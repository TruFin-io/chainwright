import { W as WalletProfileFixtureArgs } from '../../types-aoLElQ63.js';
import { W as WorkerScopeFixture } from '../../worker-scope-context-DSkOcWf-.js';
export { w as workerScopeContext } from '../../worker-scope-context-DSkOcWf-.js';
import * as _playwright_test from '@playwright/test';
import { BrowserContext, Page } from '@playwright/test';
import z from 'zod';

declare class SolflareProfile {
    readonly name: "solflare";
    readonly onboardingPath = "wallet.html#/onboard";
    indexUrl(): Promise<string>;
    promptUrl(): Promise<string>;
    extensionId(): Promise<string>;
    promptPage(context: BrowserContext): Promise<_playwright_test.Page>;
}

type OnboardingArgs = {
    recoveryPhrase: string;
    walletName?: string;
    network?: "Mainnet" | "Devnet" | "Testnet";
    additionalAccounts?: Array<AddAccountArgs>;
};
type SwitchNetwork = Omit<Required<OnboardingArgs>, "recoveryPhrase">["network"];
declare const addAccountSchema: z.ZodObject<{
    walletName: z.ZodString;
    privateKey: z.ZodString;
}, z.core.$strip>;
type AddAccountArgs = z.infer<typeof addAccountSchema>;
type RenameAccountArgs = {
    currentAccountName: string;
    newAccountName: string;
};
type SolflareFixture = {
    contextPath: string;
    solflare: Solflare;
    solflarePage: Page;
    autoCloseNotification: undefined;
};

declare class Solflare extends SolflareProfile {
    page: Page;
    constructor(page: Page);
    /**
     * Onboards the wallet.
     * This function onboards the wallet by entering the password and other required information.
     * @param {OnboardingArgs} args - The arguments required for onboarding.
     * @param args.mode - Create a new wallet or import via private key / mnemonic.
     * @param args.password - The password for the wallet.
     * @param args.secretRecoveryPhrase - The secret recovery phrase for the wallet when importing a wallet.
     * @example
     * const solflare = new Solflare(page);
     * await solflare.onboard({ mode: "importPrivateKey", password: "password", privateKey: "private key" });
     */
    onboard({ recoveryPhrase, network, additionalAccounts, walletName }: OnboardingArgs): Promise<void>;
    /**
     * Unlocks the wallet by entering the password.
     * @example
     * const solflare = new Solflare(page);
     * await solflare.unlock();
     */
    unlock(): Promise<void>;
    /**
     * Locks the wallet by entering the password.
     * This function locks the wallet by opening the settings page and then locking the wallet.
     * @example
     * const solflare = new Solflare(page);
     * await solflare.lock();
     */
    lock(): Promise<void>;
    /**
     * Renames an account in the wallet.
     * @param {Omit<RenameAccount, "page">} args - The arguments to rename the account.
     * @param args.newAccountName - The new name of the account.
     * @example
     * const solflare = new Solflare(page);
     * await solflare.renameAccount({ newAccountName: "New Account Name" });
     */
    renameAccount({ currentAccountName, newAccountName }: RenameAccountArgs): Promise<void>;
    /**
     * Switches the current network to the given network.
     * @param {SwitchNetwork} networkName - The name of the network to switch to.
     * @example
     * const solflare = new Solflare(page);
     * await solflare.switchNetwork("network name");
     */
    switchNetwork(network: SwitchNetwork): Promise<void>;
    /**
     * Switches the current account to the given account.
     * @param {string} accountName - The name of the account to switch to.
     * @example
     * const solflare = new solflare(page);
     * await solflare.switchAccount("Account 1");
     */
    switchAccount(accountName: string): Promise<void>;
    /**
     * Retrieves the current account's address.
     * @returns A promise that resolves with the current account's address as a string.
     *
     * @example
     * const solflare = new Solflare(page);
     * const address = await solflare.getAccountAddress();
     */
    getAccountAddress(): Promise<string>;
    /**
     * Adds an account to the wallet via a private key or mnemonic phrase.
     * @param {{ accountName, ...args }: AddAccount} - The arguments to add the account.
     * @param {string} args.walletName - The name of the account to add.
     * @param {string} args.privateKey - The private key of the account to add, if the mode is "privateKey".
     * @example
     * const solflare = new Solflare(page);
     * await solflare.addAccount({ walletName: "Gamify", privateKey: "private key"});
     */
    addAccount({ privateKey, walletName }: AddAccountArgs): Promise<void>;
    /**
     * Connects to an app by clicking on the "Connect to app" button.
     * If an account is provided, it will be selected before connecting to the app.
     * @param {string} [account] - The account to select before connecting to the app.
     * @example
     * const solflare = new Solflare(page);
     * await solflare.connectToApp("Account 1");
     */
    connectToApp(account?: string): Promise<void>;
    /**
     * Confirms a transaction in the wallet by clicking on the "Confirm" button.
     * @example
     * const solflare = new Solflare(page);
     * await solflare.confirmTransaction();
     */
    confirmTransaction(): Promise<void>;
    /**
     * Rejects a transaction in the wallet by clicking on the "Reject" button.
     * @example
     * const solflare = new Solflare(page);
     * await solflare.rejectTransaction();
     */
    rejectTransaction(): Promise<void>;
}

declare const solflareFixture: ({ slowMo, profileName }?: WalletProfileFixtureArgs) => _playwright_test.TestType<_playwright_test.PlaywrightTestArgs & _playwright_test.PlaywrightTestOptions & SolflareFixture, _playwright_test.PlaywrightWorkerArgs & _playwright_test.PlaywrightWorkerOptions>;

declare const solflareWorkerScopeFixture: ({ slowMo, profileName }?: WalletProfileFixtureArgs) => _playwright_test.TestType<_playwright_test.PlaywrightTestArgs & _playwright_test.PlaywrightTestOptions & SolflareFixture, _playwright_test.PlaywrightWorkerArgs & _playwright_test.PlaywrightWorkerOptions & WorkerScopeFixture<Solflare>>;

export { Solflare, WalletProfileFixtureArgs, WorkerScopeFixture, solflareFixture, solflareWorkerScopeFixture };
