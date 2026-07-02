import { W as WalletProfileFixtureArgs } from '../../types-aoLElQ63.js';
import { W as WorkerScopeFixture } from '../../worker-scope-context-DSkOcWf-.js';
export { w as workerScopeContext } from '../../worker-scope-context-DSkOcWf-.js';
import * as _playwright_test from '@playwright/test';
import { BrowserContext, Page } from '@playwright/test';

declare class MeteorProfile {
    readonly name: "meteor";
    readonly onboardingPath = "ext_index_popup.html";
    indexUrl(): Promise<string>;
    promptUrl(): Promise<string>;
    extensionId(): Promise<string>;
    promptPage(context: BrowserContext): Promise<_playwright_test.Page>;
}

type MeteorNetwork = "Mainnet" | "Testnet";
type SharedOnboardArgs = {
    network: MeteorNetwork;
    accountName: string;
    additionalAccounts?: Array<AddAccountArgs>;
};
type OnboardingArgs = ({
    mode: "privateKey";
    privateKey: string;
} | {
    mode: "secretPhrase";
    secretPhrase: string;
}) & SharedOnboardArgs;
type RenameAccountArgs = {
    newAccountName: string;
};
type AddAccountCommonArgs = {
    accountName: string;
    network: MeteorNetwork;
};
type AddAccountArgs = ({
    privateKey: string;
    mode: "privateKey";
} | {
    secretPhrase: string;
    mode: "secretPhrase";
}) & AddAccountCommonArgs;
type MeteorFixture = {
    contextPath: string;
    meteor: Meteor;
    meteorPage: Page;
};

declare class Meteor extends MeteorProfile {
    page: Page;
    constructor(page: Page);
    /**
     * Onboards the wallet.
     * This function onboards the wallet by entering the password and other required information.
     * @param {OnboardingArgs} args - The arguments required for onboarding.
     * @param args.password - The password for the wallet.
     * @param args.secretRecoveryPhrase - The secret recovery phrase for the wallet when importing a wallet.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.onboard({ mode: "importPrivateKey", password: "password", privateKey: "private key" });
     */
    onboard({ network, accountName, additionalAccounts, ...args }: OnboardingArgs): Promise<void>;
    /**
     * Unlocks the wallet by entering the password.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.unlock();
     */
    unlock(): Promise<void>;
    /**
     * Locks the wallet by entering the password.
     * This function locks the wallet by opening the settings page and then locking the wallet.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.lock();
     */
    lock(): Promise<void>;
    /**
     * Renames an account in the wallet.
     * @param {Omit<RenameAccount, "page">} args - The arguments to rename the account.
     * @param args.newAccountName - The new name of the account.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.renameAccount({ newAccountName: "New Account Name" });
     */
    renameAccount({ newAccountName }: RenameAccountArgs): Promise<void>;
    /**
     * Switches the current network to the given network.
     * @param {SwitchNetwork} networkName - The name of the network to switch to.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.switchNetwork("network name");
     */
    switchNetwork(network: MeteorNetwork): Promise<void>;
    /**
     * Switches the current account to the given account.
     * @param {string} accountName - The name of the account to switch to.
     * @example
     * const meteor = new meteor(page);
     * await meteor.switchAccount("Account 1");
     */
    switchAccount(accountName: string): Promise<void>;
    /**
     * Retrieves the current account's address.
     * @returns A promise that resolves with the current account's address as a string.
     *
     * @example
     * const meteor = new Meteor(page);
     * const address = await meteor.getAccountAddress();
     */
    getAccountAddress(): Promise<string>;
    /**
     * Adds an account to the wallet via a private key or mnemonic phrase.
     * @param {{ accountName, ...args }: AddAccount} - The arguments to add the account.
     * @param {string} args.accountName - The name of the account to add.
     * @param {string} args.privateKey - The private key of the account to add, if the mode is "privateKey".
     * @param {string[]} args.mnemonicPhrase - The mnemonic phrase of the account to add, if the mode is "mnemonic".
     * @example
     * const meteor = new Meteor(page);
     * await meteor.addAccount(TBD);
     */
    addAccount({ accountName, network, ...args }: AddAccountArgs): Promise<void>;
    /**
     * Opens the settings page for the wallet.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.openSettings();
     */
    openSettings(): Promise<void>;
    /**
     * Connects to an app by clicking on the "Connect" button.
     * If an account is provided, it will be selected before connecting to the app.
     * @param {string} [account] - The account to select before connecting to the app.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.connectToApp("Account 1");
     */
    connectToApp(account?: string): Promise<void>;
    /**
     * Confirms the wallet's disconnection from the app.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.confirmDisconnect();
     */
    confirmDisconnect(): Promise<void>;
    /**
     * Confirms a transaction in the wallet by clicking on the "Approve" button.
     * This function confirms a transaction in the wallet by clicking on the "Approve" button.
     * It first opens the popup page and then clicks on the "Confirm" button.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.confirmTransaction();
     */
    confirmTransaction(): Promise<void>;
    /**
     * Cancels a transaction in the wallet by clicking on the "Cancel" button.
     * This function cancels a transaction in the wallet by clicking on the "Cancel" button.
     * It first opens the popup page and then clicks on the "Cancel" button.
     * @example
     * const meteor = new Meteor(page);
     * await meteor.cancelTransaction();
     */
    rejectTransaction(): Promise<void>;
}

declare const meteorFixture: ({ slowMo, profileName }?: WalletProfileFixtureArgs) => _playwright_test.TestType<_playwright_test.PlaywrightTestArgs & _playwright_test.PlaywrightTestOptions & MeteorFixture, _playwright_test.PlaywrightWorkerArgs & _playwright_test.PlaywrightWorkerOptions>;

declare const meteorWorkerScopeFixture: ({ slowMo, profileName }?: WalletProfileFixtureArgs) => _playwright_test.TestType<_playwright_test.PlaywrightTestArgs & _playwright_test.PlaywrightTestOptions & MeteorFixture, _playwright_test.PlaywrightWorkerArgs & _playwright_test.PlaywrightWorkerOptions & WorkerScopeFixture<Meteor>>;

export { Meteor, WalletProfileFixtureArgs, WorkerScopeFixture, meteorFixture, meteorWorkerScopeFixture };
