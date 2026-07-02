import { Page, BrowserContext, WorkerInfo } from '@playwright/test';
import { S as SupportedWallets } from './types-aoLElQ63.js';

/**
 * Core wallet interface
 */
declare abstract class BaseWallet {
    abstract name: SupportedWallets;
    abstract onboardingPath: string;
    abstract indexUrl(): Promise<string>;
    abstract extensionId(): Promise<string>;
}

type WorkerScopeContext<W> = {
    workerInfo: WorkerInfo;
    wallet: W;
    profileName?: string;
    slowMo?: number;
};
type WorkerScopeFixture<Wallet> = {
    workerScopeContents: {
        wallet: Wallet;
        walletPage: Page;
        context: BrowserContext;
    };
    dappPage: Page;
};
declare function workerScopeContext<T extends BaseWallet>({ wallet, workerInfo, profileName, slowMo, }: WorkerScopeContext<T>): Promise<{
    context: BrowserContext;
    walletPage: Page;
    contextPath: string;
}>;

export { type WorkerScopeFixture as W, workerScopeContext as w };
