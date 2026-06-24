import fs from "node:fs";
import path from "node:path";
import { chromium, type WorkerInfo } from "@playwright/test";
import createTempContextDirectory from "@/utils/create-temp-context-directory";
import getCacheDirectory from "@/utils/get-cache-directory";
import getPageFromContext from "@/utils/get-page-from-context";
import { getWalletExtensionPathFromCache } from "@/utils/wallets/get-wallet-extension-path-from-cache";
import { getBrowserArgs } from "../utils/get-browser-args";
import { PhantomProfile } from "./phantom-profile";

type WorkerScopeContext = {
    workerInfo: WorkerInfo;
    profileName?: string;
    slowMo?: number;
};

// Create a worker context for all wallets
export async function workerScopeContextPhantom({ workerInfo, profileName, slowMo }: WorkerScopeContext) {
    const wallet = new PhantomProfile();
    const contextPath = await createTempContextDirectory(workerInfo.workerIndex.toString());
    const CACHE_DIR = getCacheDirectory(wallet.name);
    const walletDataDir = path.resolve(CACHE_DIR, profileName ?? "wallet-data");

    if (!fs.existsSync(walletDataDir)) {
        throw new Error(`Cache for ${wallet.name} does not exist. Create it first!`);
    }

    fs.cpSync(walletDataDir, contextPath, { recursive: true, force: true });
    const walletPath = await getWalletExtensionPathFromCache(wallet.name);

    const browserArgs = getBrowserArgs(walletPath, slowMo ?? 0);
    const context = await chromium.launchPersistentContext(contextPath, {
        headless: false,
        args: browserArgs,
        slowMo: process.env.HEADLESS ? 0 : slowMo,
    });

    const indexUrl = await wallet.indexUrl();
    const page = await getPageFromContext(context, indexUrl);

    return { context, walletPage: page, contextPath };
}
