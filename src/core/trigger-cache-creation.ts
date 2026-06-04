import fs from "node:fs";
import path from "node:path";
import { styleText } from "node:util";
import { chromium } from "@playwright/test";
import type { GetSetupFunctionFileList, SupportedWallets, WalletSetupConfig, WalletSetupFunction } from "@/types";
import getCacheDirectory from "@/utils/get-cache-directory";
import { getWalletExtensionIdFromBrowser } from "@/utils/wallets/get-wallet-extension-id-from-browser";
import { SUPPORTED_WALLETS } from "../utils/constants";
import { prepareWalletExtension } from "../utils/prepare-wallet-extension";
import { waitForExtensionOnLoadPage } from "../utils/wait-for-extension-on-load-page";

type Args = {
    walletName: SupportedWallets;
    force: boolean;
    setupFunction: WalletSetupFunction;
    walletPassword: string;
    fileList: GetSetupFunctionFileList[];
    config?: WalletSetupConfig;
};

export async function triggerCacheCreation({
    walletName,
    force,
    config,
    fileList,
    walletPassword,
    setupFunction,
}: Args) {
    const { downloadUrl, extensionName } = SUPPORTED_WALLETS[walletName];
    const CACHE_DIR_NAME = getCacheDirectory(walletName);
    const walletProfile = config?.profileName;

    const walletProfileDir = walletProfile ? `${walletProfile}` : "wallet-data";
    const extensionIdPathTxt = path.resolve(CACHE_DIR_NAME, "extension-id.txt");
    const extensionPathTxt = path.resolve(CACHE_DIR_NAME, "extension-path.txt");
    const passwordTxt = path.resolve(CACHE_DIR_NAME, "password.txt");
    const walletDataDir = path.resolve(CACHE_DIR_NAME, walletProfileDir);

    const extensionPath = await prepareWalletExtension({
        downloadUrl,
        name: walletName,
        force,
    });

    const browserArgs = [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`];

    if (fs.existsSync(walletDataDir) && fileList.length > 1) {
        throw Error(
            [
                styleText(
                    "yellowBright",
                    [
                        `❌ ${walletProfileDir} directory already exists for ${extensionName}.`,
                        `\n To setup another wallet profile, add a profile name to the wallet setup function.`,
                        styleText(
                            ["blueBright", "italic"],
                            `Example: defineWalletSetup(async ({ context, walletPage }) => { ... }, { profileName: "profile-name" });`,
                        ),
                        styleText("italic", `You can also use the --force flag to overwrite the existing cache.`),
                    ].join("\n"),
                    { validateStream: false },
                ),
            ].join("\n"),
        );
    }

    if (fs.existsSync(walletDataDir)) {
        return void 0;
    }

    const context = await chromium.launchPersistentContext(walletDataDir, {
        headless: false,
        args: browserArgs,
        slowMo: config?.slowMo ?? 0,
    });

    console.info(
        styleText("magentaBright", `🧩🚀 Starting Chrome extension for ${walletName.toUpperCase()}`, {
            validateStream: false,
        }),
    );
    const walletPage = await waitForExtensionOnLoadPage(context, walletName);

    if (!fs.existsSync(extensionIdPathTxt) && !fs.existsSync(extensionPathTxt)) {
        const extensionId = await getWalletExtensionIdFromBrowser(context, extensionName);
        console.info(
            styleText("magentaBright", `🆔 ${extensionName} extension ID: ${extensionId}`, { validateStream: false }),
        );

        fs.writeFileSync(extensionIdPathTxt, extensionId, "utf-8");
        console.info(
            styleText("cyanBright", `💾 Saved extension ID to: ${extensionIdPathTxt}`, { validateStream: false }),
        );

        // Save extension path to disk
        fs.writeFileSync(extensionPathTxt, extensionPath, "utf-8");
        console.info(
            styleText("blueBright", `📁 Saved extension Path to: ${extensionPathTxt}`, { validateStream: false }),
        );

        fs.writeFileSync(passwordTxt, walletPassword, "utf-8");
        console.info(
            styleText("yellowBright", `🔑 Saved ${walletName} password to: ${passwordTxt}`, { validateStream: false }),
        );
    }

    try {
        await setupFunction({ context, walletPage });
    } catch (error) {
        await context.close();
        fs.rmSync(CACHE_DIR_NAME, { force: true, recursive: true });
        throw Error(`Error setting up wallet: ${(error as Error).message}`);
    }

    await context.close();
}
