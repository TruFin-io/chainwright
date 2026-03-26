import { test as base } from "@playwright/test";
import { Instance, Pool } from "prool";
import type { WorkerScopeFixtureArgs } from "@/types";
import { teardownContext } from "@/utils/teardown-context";
import type { WorkerScopeFixture } from "../utils/worker-scope-context";
import { Metamask } from "./metamask";
import type { MetamaskFixture } from "./types";
import { workerScopeContextMetamask } from "./worker-scope-context.metamask";

export const metamaskWorkerScopeFixture = ({ profileName, dappUrl, slowMo }: WorkerScopeFixtureArgs = {}) => {
    return base.extend<MetamaskFixture, WorkerScopeFixture<Metamask>>({
        workerScopeContents: [
            async ({ browser: _ }, use, workerInfo) => {
                const {
                    context,
                    contextPath,
                    walletPage: walletPageFromContext,
                } = await workerScopeContextMetamask({
                    workerInfo,
                    profileName,
                    slowMo,
                });
                await context.grantPermissions(["clipboard-read"]);
                const metamask = new Metamask(walletPageFromContext);
                await metamask.unlock();

                await use({ wallet: metamask, walletPage: walletPageFromContext, context });
                await teardownContext(context, contextPath);
            },
            { scope: "worker" },
        ],
        dappPage: [
            async ({ workerScopeContents }, use) => {
                const { context } = workerScopeContents;
                const dappPage = await context.newPage();
                if (dappUrl) {
                    await dappPage.goto(dappUrl);
                }
                await use(dappPage);
            },
            { scope: "worker" },
        ],
        metamaskPage: async ({ workerScopeContents }, use) => {
            await use(workerScopeContents.walletPage);
        },
        metamask: async ({ workerScopeContents }, use) => {
            const metamaskInstance = new Metamask(workerScopeContents.walletPage);
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
