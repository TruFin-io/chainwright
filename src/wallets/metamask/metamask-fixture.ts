import fs from "node:fs";
import path from "node:path";
import { test as base, chromium, type Page } from "@playwright/test";
import { Instance, Pool } from "prool";
import createTempContextDirectory from "@/utils/create-temp-context-directory";
import getCacheDirectory from "@/utils/get-cache-directory";
import getPageFromContext from "@/utils/get-page-from-context";
import persistLocalStorage from "@/utils/persist-local-storage";
import { teardownContext } from "@/utils/teardown-context";
import { getWalletExtensionPathFromCache } from "@/utils/wallets/get-wallet-extension-path-from-cache";
import unlock from "./actions/unlock.metamask";
import { Metamask } from "./metamask";
import { MetamaskProfile } from "./metamask-profile";
import type { MetamaskFixture } from "./types";

let _metamaskPage: Page;

export const metamaskFixture = (slowMo: number = 0, profileName?: string) => {
    return base.extend<MetamaskFixture>({
        contextPath: async ({ browserName }, use, testInfo) => {
            const tempWalletDataDir = await createTempContextDirectory(`${browserName}-${testInfo.testId}`);
            await use(tempWalletDataDir);
        },
        context: async ({ context: currentContext, contextPath: tempWalletDataDir }, use) => {
            const wallet = new MetamaskProfile();

            const CACHE_DIR = getCacheDirectory(wallet.name);
            const extensionPath = await getWalletExtensionPathFromCache(wallet.name);
            const walletDataDir = path.resolve(CACHE_DIR, profileName ?? "wallet-data");

            if (!fs.existsSync(walletDataDir)) {
                throw new Error(`❌ Cache for MetaMask wallet data not found. Create it first`);
            }

            fs.cpSync(walletDataDir, tempWalletDataDir, { recursive: true, force: true });

            const browserArgs = [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`];
            if (process.env.HEADLESS) {
                browserArgs.push("--headless=new");

                if (slowMo > 0) {
                    console.warn("⚠️ Slow motion makes no sense in headless mode. It will be ignored!");
                }
            }

            const walletPageContext = await chromium.launchPersistentContext(tempWalletDataDir, {
                headless: false,
                args: [`--disable-extensions-except=${extensionPath}`],
                slowMo: process.env.HEADLESS ? 0 : slowMo,
            });

            const { cookies, origins } = await currentContext.storageState();
            if (cookies) await walletPageContext.addCookies(cookies);
            if (origins && origins.length > 0) persistLocalStorage(origins, walletPageContext);

            const indexUrl = await wallet.indexUrl();
            await walletPageContext.waitForEvent("page", {
                predicate: (page) => page.url().startsWith(indexUrl),
                timeout: 30_000,
            });

            const homePage = walletPageContext.pages().find((page) => page.url().startsWith(indexUrl));
            _metamaskPage = homePage ?? (await getPageFromContext(walletPageContext, indexUrl));

            for (const page of walletPageContext.pages()) {
                if (page.url().includes("about:blank")) await page.close();
            }

            const loadingSpinner = _metamaskPage.locator("img[class='loading-spinner']");
            await loadingSpinner.waitFor({ state: "detached" });

            await unlock(_metamaskPage);
            await use(walletPageContext);
            await teardownContext(walletPageContext, tempWalletDataDir);
        },
        metamaskPage: async ({ context: _ }, use) => {
            await use(_metamaskPage);
        },
        metamask: async ({ context: _ }, use) => {
            const metamaskInstance = new Metamask(_metamaskPage);
            await use(metamaskInstance);
        },
        createAnvilNode: async ({ context: _ }, use, testInfo) => {
            const poolId = testInfo.workerIndex;
            let pool: Pool.define.ReturnType<number> | undefined;

            await use(async (options?: Instance.anvil.Parameters) => {
                pool = Pool.define({
                    instance: Instance.anvil(options),
                });
                const anvil = await pool.start(poolId);
                const rpcUrl = `http://${anvil.host}:${anvil.port}`;

                const DEFAULT_ANVIL_CHAIN_ID = 31337;
                const chainId = options?.chainId ?? DEFAULT_ANVIL_CHAIN_ID;

                return { rpcUrl, anvil, chainId };
            });

            if (pool) {
                await pool.stop(poolId);
            }
        },
        connectToAnvil: async ({ context: _, metamask, createAnvilNode }, use) => {
            await use(async () => {
                const { chainId, rpcUrl } = await createAnvilNode({ chainId: 2251 });
                await metamask.addCustomNetwork({
                    chainId,
                    currencySymbol: "ETH",
                    networkName: "Anvil Localnet",
                    rpcUrl: rpcUrl,
                });
            });
        },
    });
};
