import { W as WalletProfileFixtureArgs } from '../../types-aoLElQ63.js';
import { W as WorkerScopeFixture } from '../../worker-scope-context-DSkOcWf-.js';
export { w as workerScopeContext } from '../../worker-scope-context-DSkOcWf-.js';
import * as _playwright_test from '@playwright/test';
import { Page, BrowserContext } from '@playwright/test';

type RenameAccount = {
    page: Page;
    newAccountName: string;
};

declare class PetraProfile {
    readonly name: "petra";
    readonly onboardingPath = "/onboarding.html";
    indexUrl(): Promise<string>;
    promptUrl(): Promise<string>;
    extensionId(): Promise<string>;
    promptPage(context: BrowserContext): Promise<_playwright_test.Page>;
}

type OnboardingArgs = {
    mode: "create";
    accountName: string;
    network: SwitchNetwork;
    additionalAccounts?: Array<AddAccount>;
} | {
    mode: "importMnemonic";
    accountName: string;
    network: SwitchNetwork;
    secretRecoveryPhrase: string;
    additionalAccounts?: Array<AddAccount>;
} | {
    mode: "importPrivateKey";
    accountName: string;
    network: SwitchNetwork;
    privateKey: string;
    additionalAccounts?: Array<AddAccount>;
};
type SwitchNetwork = "Mainnet" | "Testnet" | "Devnet" | "Shelbynet" | "Netna";
type AddAccount = {
    mode: "privateKey";
    accountName: string;
    privateKey: string;
} | {
    mode: "mnemonic";
    accountName: string;
    mnemonicPhrase: string;
};
type PetraFixture = {
    contextPath: string;
    petra: Petra;
    petraPage: Page;
};

declare class Petra extends PetraProfile {
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
     * const petra = new Petra(page);
     * await petra.onboard({ mode: "importPrivateKey", password: "password", privateKey: "private key" });
     */
    onboard(args: OnboardingArgs): Promise<void>;
    /**
     * Unlocks the wallet by entering the password.
     * @example
     * const petra = new Petra(page);
     * await petra.unlock();
     */
    unlock(): Promise<void>;
    /**
     * Locks the wallet by entering the password.
     * This function locks the wallet by opening the settings page and then locking the wallet.
     * @example
     * const petra = new Petra(page);
     * await petra.lock();
     */
    lock(): Promise<void>;
    /**
     * Renames an account in the wallet.
     * @param {Omit<RenameAccount, "page">} args - The arguments to rename the account.
     * @param args.newAccountName - The new name of the account.
     * @example
     * const petra = new Petra(page);
     * await petra.renameAccount({ newAccountName: "New Account Name" });
     */
    renameAccount({ newAccountName }: Omit<RenameAccount, "page">): Promise<void>;
    /**
     * Switches the current network to the given network.
     * @param {SwitchNetwork} networkName - The name of the network to switch to.
     * @example
     * const petra = new Petra(page);
     * await petra.switchNetwork("Testnet");
     */
    switchNetwork(networkName: SwitchNetwork): Promise<void>;
    /**
     * Switches the current account to the given account.
     * @param {string} accountName - The name of the account to switch to.
     * @example
     * const petra = new Petra(page);
     * await petra.switchAccount("Account 1");
     */
    switchAccount(accountName: string): Promise<void>;
    /**
     * Retrieves the current account's address.
     * @returns A promise that resolves with the current account's address as a string.
     *
     * @example
     * const petra = new Petra(page);
     * const address = await petra.getAccountAddress();
     */
    getAccountAddress(): Promise<string>;
    /**
     * Adds an account to the wallet via a private key or mnemonic phrase.
     * @param {{ accountName, ...args }: AddAccount} - The arguments to add the account.
     * @param {string} args.accountName - The name of the account to add.
     * @param {string} args.privateKey - The private key of the account to add, if the mode is "privateKey".
     * @param {string[]} args.mnemonicPhrase - The mnemonic phrase of the account to add, if the mode is "mnemonic".
     * @example
     * const petra = new Petra(page);
     * await petra.addAccount({ accountName: "Account 1", privateKey: "private key", mode: "privateKey" });
     */
    addAccount({ accountName, ...args }: AddAccount): Promise<void>;
    /**
     * Connects to an app by clicking on the "Connect to app" button.
     * If an account is provided, it will be selected before connecting to the app.
     * @param {string} [account] - The account to select before connecting to the app.
     * @example
     * const petra = new Petra(page);
     * await petra.connectToApp("Account 1");
     */
    connectToApp(account?: string): Promise<void>;
    /**
     * Confirms a transaction in the wallet by clicking on the "Approve" button.
     *
     * @example
     * const petra = new Petra(page);
     * await petra.confirmTransaction();
     */
    confirmTransaction(): Promise<void>;
    /**
     * Rejects a transaction in the wallet by clicking on the "Cancel" button.
     *
     * @example
     * const petra = new Petra(page);
     * await petra.rejectTransaction();
     * */
    rejectTransaction(): Promise<void>;
}

declare const petraFixture: ({ slowMo, profileName }?: WalletProfileFixtureArgs) => _playwright_test.TestType<_playwright_test.PlaywrightTestArgs & _playwright_test.PlaywrightTestOptions & PetraFixture, _playwright_test.PlaywrightWorkerArgs & _playwright_test.PlaywrightWorkerOptions>;

declare const petraWorkerScopeFixture: ({ slowMo, profileName }?: WalletProfileFixtureArgs) => _playwright_test.TestType<_playwright_test.PlaywrightTestArgs & _playwright_test.PlaywrightTestOptions & PetraFixture, _playwright_test.PlaywrightWorkerArgs & _playwright_test.PlaywrightWorkerOptions & WorkerScopeFixture<Petra>>;

export { Petra, WalletProfileFixtureArgs, WorkerScopeFixture, petraFixture, petraWorkerScopeFixture };
