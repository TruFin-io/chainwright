import { W as WalletProfileFixtureArgs } from '../../types-aoLElQ63.js';
import { W as WorkerScopeFixture } from '../../worker-scope-context-DSkOcWf-.js';
export { w as workerScopeContext } from '../../worker-scope-context-DSkOcWf-.js';
import * as _playwright_test from '@playwright/test';
import { BrowserContext, Page } from '@playwright/test';
import z from 'zod';

declare class KeplrProfile {
    readonly name: "keplr";
    readonly onboardingPath = "register.html";
    indexUrl(): Promise<string>;
    onboardingUrl(): Promise<string>;
    promptUrl(): Promise<string>;
    extensionId(): Promise<string>;
    promptPage(context: BrowserContext): Promise<_playwright_test.Page>;
}

declare const keplrChains: readonly ["Injective", "Injective (Testnet)", "Polygon", "Bitcoin", "Bitcoin Signet", "Bitcoin Testnet"];
type KeplrChains = (typeof keplrChains)[number];
type AddAndOnboardingArgs = {
    walletName: string;
    seedPhrase: string;
    mode: "seedPhrase";
    chains: Array<KeplrChains>;
} | {
    walletName: string;
    privateKey: string;
    mode: "privateKey";
    chains: Array<KeplrChains>;
};
type OnboardingArgs = Array<AddAndOnboardingArgs>;
type AddAccount = {
    walletName: string;
    chains: Array<KeplrChains>;
} & {
    mode: "add-account-multiple" | "add-account-single" | "onboard";
};
interface AddAccountViaPrivateKey extends AddAccount {
    privateKey: string;
}
interface AddAccountViaSeedPhrase extends AddAccount {
    seedPhrase: string;
}
declare const getAccountAddressSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    chain: z.ZodLiteral<"Injective" | "Injective (Testnet)" | "Polygon">;
    walletName: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    chain: z.ZodLiteral<"Bitcoin" | "Bitcoin Signet" | "Bitcoin Testnet">;
    chainTag: z.ZodLiteral<"Taproot" | "Native Segwit">;
    walletName: z.ZodString;
}, z.core.$strip>], "chain">;
type GetAccountAddressArgs = z.infer<typeof getAccountAddressSchema>;
declare const renameAccountSchema: z.ZodObject<{
    currentAccountName: z.ZodString;
    newAccountName: z.ZodString;
}, z.core.$strip>;
type RenameAccountArgs = z.infer<typeof renameAccountSchema>;
type KeplrFixture = {
    contextPath: string;
    keplr: Keplr;
    keplrPage: Page;
};

declare class Keplr extends KeplrProfile {
    page: Page;
    constructor(page: Page);
    /**
     * Onboards the wallet.
     * @param {OnboardingArgs} args - The arguments required for onboarding.
     * @param args[0].chains - The chains to onboard the wallet on.
     * @param args[0].privateKey - The private key of the wallet to onboard.
     * @param args[0].walletName - The name of the wallet to onboard.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.onboard([
     *      {
     *          chains: ["Injective", "Injective (Testnet)"],
     *          privateKey: "private key",
     *          walletName: "Wallet Name"
     *      }
     * ]);
     */
    onboard(args: OnboardingArgs): Promise<void>;
    /**
     * Unlocks the wallet by entering the password.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.unlock();
     */
    unlock(): Promise<void>;
    /**
     * Locks the wallet by entering the password.
     * This function locks the wallet by opening the settings page and then locking the wallet.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.lock();
     */
    lock(): Promise<void>;
    /**
     * Renames an account in the wallet.
     * @param {RenameAccount} args - The arguments to rename the account.
     * @param args.currentName - The current name of the active account.
     * @param args.newAccountName - The new name of the account.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.renameAccount({ newAccountName: "New Account Name" });
     */
    renameAccount({ currentAccountName, newAccountName }: RenameAccountArgs): Promise<void>;
    /**
     * Switches the current account to the given account.
     * @param accountName - The name of the account to switch to.
     * @example
     * const keplr = new keplr(page);
     * await keplr.switchAccount("Account 1");
     */
    switchAccount(accountName: string): Promise<void>;
    /**
     * Retrieves the current account's address.
     * @returns A promise that resolves with the current account's address as a string.
     *
     * @example
     * const keplr = new Keplr(page);
     * const address = await keplr.getAccountAddress();
     */
    getAccountAddress({ ...args }: GetAccountAddressArgs): Promise<string>;
    /**
     * Adds an account to the wallet via a private key or mnemonic phrase.
     * @param {AddAccountArgs} args - The arguments to add the account.
     * @param args.chains - The chains of the account to add.
     * @param args.privateKey - The private key of the account to add, if the mode is "privateKey".
     * @param args.seedPhrase - The seed phrase of the account to add, if the mode is "seedPhrase".
     * @param args.walletName - The name of the wallet to add the account to.
     * @param args.mode - The mode of adding the account (default: "add-account-multiple").
     * @example
     * const keplr = new Keplr(page);
     * await keplr.addAccount({ chains: ["Testnet"], privateKey: "private key", walletName: "Keplr Wallet", mode: "add-account-multiple" });
     */
    addAccount({ chains, walletName, mode, ...args }: AddAccountViaPrivateKey | AddAccountViaSeedPhrase): Promise<void>;
    /**
     * Connects to the wallet.
     * This function connects to the wallet by opening the connect page and then clicking on the connect button.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.connectToApp();
     */
    connectToApp(): Promise<void>;
    /**
     * Confirms a transaction in the wallet by clicking on the "Approve" button.
     * This function confirms a transaction in the wallet by opening the popup page and then clicking on the "Approve" button.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.confirmTransaction();
     */
    confirmTransaction(): Promise<void>;
    /**
     * Rejects a transaction in the wallet by clicking on the "Reject" button.
     * This function rejects a transaction in the wallet by opening the popup page and then clicking on the "Reject" button.
     * @example
     * const keplr = new Keplr(page);
     * await keplr.rejectTransaction();
     */
    rejectTransaction(): Promise<void>;
}

declare const keplrFixture: ({ slowMo, profileName }?: WalletProfileFixtureArgs) => _playwright_test.TestType<_playwright_test.PlaywrightTestArgs & _playwright_test.PlaywrightTestOptions & KeplrFixture, _playwright_test.PlaywrightWorkerArgs & _playwright_test.PlaywrightWorkerOptions>;

declare const keplrWorkerScopeFixture: ({ slowMo, profileName }?: WalletProfileFixtureArgs) => _playwright_test.TestType<_playwright_test.PlaywrightTestArgs & _playwright_test.PlaywrightTestOptions & KeplrFixture, _playwright_test.PlaywrightWorkerArgs & _playwright_test.PlaywrightWorkerOptions & WorkerScopeFixture<Keplr>>;

export { Keplr, WalletProfileFixtureArgs, WorkerScopeFixture, keplrFixture, keplrWorkerScopeFixture };
