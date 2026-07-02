import { W as WalletProfileFixtureArgs } from '../../types-aoLElQ63.js';
import { W as WorkerScopeFixture } from '../../worker-scope-context-DSkOcWf-.js';
export { w as workerScopeContext } from '../../worker-scope-context-DSkOcWf-.js';
import * as _playwright_test from '@playwright/test';
import { BrowserContext, Page } from '@playwright/test';

declare class PhantomProfile {
    readonly name: "phantom";
    readonly onboardingPath = "/onboarding.html";
    indexUrl(): Promise<string>;
    promptUrl(): Promise<string>;
    extensionId(): Promise<string>;
    promptPage(context: BrowserContext): Promise<_playwright_test.Page>;
}

type OnboardingArgs = {
    mode: "create";
    accountName: string;
    toggleNetworkMode?: SwitchNetwork;
    additionalAccounts?: Array<AddAccountArgs>;
} | {
    mode: "recovery phrase";
    accountName: string;
    secretRecoveryPhrase: string;
    toggleNetworkMode?: SwitchNetwork;
    additionalAccounts?: Array<AddAccountArgs>;
} | {
    mode: "private key";
    privateKey: string;
    accountName: string;
    chain: "Ethereum" | "Solana" | "Base" | "Sui" | "Bitcoin" | "Polygon" | "HyperEVM";
    toggleNetworkMode?: SwitchNetwork;
    additionalAccounts?: Array<AddAccountArgs>;
};
type RenameAccountArgs = {
    currentAccountName: string;
    newAccountName: string;
};
type AddAccountArgs = {
    privateKey: string;
    accountName: string;
    chain: "Ethereum" | "Solana" | "Base" | "Sui" | "Bitcoin" | "Polygon" | "HyperEVM";
};
type OptionalChains = "Ethereum" | "Monad" | "Base" | "Sui" | "Polygon" | "Bitcoin" | "Hyperevm";
type ToggleOptionalChainMode = "on" | "off";
type ToggleOptionalChainArgs = {
    supportedChains: Array<OptionalChains>;
    toggleMode: ToggleOptionalChainMode;
};
type SwitchNetwork = ({
    mode: "on";
    chain: "Solana";
    network: "Solana Devnet" | "Solana Testnet" | "Solana Localnet";
} | {
    mode: "on";
    chain: "Ethereum";
    network: "Ethereum Sepolia" | "Monad Testnet" | "Base Sepolia" | "Polygon Amoy" | "HyperEVM Testnet";
}) | {
    mode: "off";
};
type GetAccountAddress = {
    accountName: string;
    chain: {
        mode: "mainnet";
        network: "Solana" | "Ethereum" | "Monad" | "Base" | "Sui" | "Polygon" | "Bitcoin" | "Hyperevm";
    } | {
        mode: "testnet";
        network: "Devnet" | "Sepolia" | "Testnet";
    };
};
type PhantomFixture = {
    contextPath: string;
    autoCloseNotification: undefined;
    phantom: Phantom;
    phantomPage: Page;
};

declare class Phantom extends PhantomProfile {
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
     * const phantom = new Phantom(page);
     * await phantom.onboard({ mode: "importPrivateKey", password: "password", privateKey: "private key" });
     */
    onboard({ ...args }: OnboardingArgs): Promise<void>;
    /**
     * Unlocks the wallet by entering the password.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.unlock();
     */
    unlock(): Promise<void>;
    /**
     * Locks the wallet by entering the password.
     * This function locks the wallet by opening the settings page and then locking the wallet.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.lock();
     */
    lock(): Promise<void>;
    /**
     * Renames an account in the wallet.
     * @param {RenameAccountArgs} args - The arguments to rename the account.
     * @param args.currentName - The current name of the active account.
     * @param args.newAccountName - The new name of the account.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.renameAccount({ newAccountName: "New Account Name", currentAccountName: "Account 1" });
     */
    renameAccount({ ...args }: RenameAccountArgs): Promise<void>;
    /**
     * Switches the current account to the given account.
     * @param {string} accountName - The name of the account to switch to.
     * @example
     * const phantom = new phantom(page);
     * await phantom.switchAccount("Account 1");
     */
    switchAccount(accountName: string): Promise<void>;
    /**
     * Retrieves the current account's address.
     * @param {string} accountName - The name of the account to switch to.
     * @returns A promise that resolves with the current account's address as a string.
     *
     * @example
     * const phantom = new Phantom(page);
     * const address = await phantom.getAccountAddress();
     */
    getAccountAddress({ accountName, chain }: GetAccountAddress): Promise<string>;
    /**
     * Adds an account to the wallet via a private key or mnemonic phrase.
     * @param {{ accountName, ...args }: AddAccount} - The arguments to add the account.
     * @param {string} args.accountName - The name of the account to add.
     * @param {string} args.privateKey - The private key of the account to add, if the mode is "privateKey".
     * @param {string[]} args.mnemonicPhrase - The mnemonic phrase of the account to add, if the mode is "mnemonic".
     * @example
     * const phantom = new Phantom(page);
     * await phantom.addAccount(TBD);
     */
    addAccount({ ...args }: AddAccountArgs): Promise<void>;
    /**
     * Toggles the optional chains on or off.
     * @param {ToggleOptionalchainArgs} args - The arguments to toggle the optional chains.
     * @param {string} args.toggleMode - The mode of the optional chains. Can be either "on" or "off".
     * @param {string[]} args.supportedChains - The list of supported chains.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.toggleOptionalChains({ supportedChains: ["Monad", "Bitcoin"], toggleMode: "off" });
     */
    toggleOptionalChains({ toggleMode, supportedChains }: ToggleOptionalChainArgs): Promise<void>;
    /**
     * Toggles the testnet network on or off.
     * @param {SwitchNetwork} args - The arguments to toggle the testnet network.
     * @param {string} args.mode - The mode of the testnet network. Can be either "on" or "off".
     * @param {string} args.chain - The name of the chain to toggle the testnet network for. Can be either "Solana" or "Ethereum".
     * @param {string} args.network - The name of the network to toggle the testnet network for. For example, "Solana Testnet".
     * @example
     * const phantom = new Phantom(page);
     * await phantom.switchNetwork({ mode: "on", chain: "Solana", network: "Solana Testnet" });
     */
    switchNetwork({ ...args }: SwitchNetwork): Promise<void>;
    /**
     * Connects to an app by clicking on the "Connect to app" button.
     * If an account is provided, it will be selected before connecting to the app.
     * @param {string} [account] - The account to select before connecting to the app.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.connectToApp("Account 1");
     */
    connectToApp(account?: string): Promise<void>;
    /**
     * Confirms a transaction in the wallet by clicking on the "Confirm" button.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.confirmTransaction();
     */
    confirmTransaction(): Promise<void>;
    /**
     * Rejects a transaction in the wallet by clicking on the "Reject" button.
     * @example
     * const phantom = new Phantom(page);
     * await phantom.rejectTransaction();
     */
    rejectTransaction(): Promise<void>;
}

declare const phantomFixture: ({ slowMo, profileName }?: WalletProfileFixtureArgs) => _playwright_test.TestType<_playwright_test.PlaywrightTestArgs & _playwright_test.PlaywrightTestOptions & PhantomFixture, _playwright_test.PlaywrightWorkerArgs & _playwright_test.PlaywrightWorkerOptions>;

declare const phantomWorkerScopeFixture: ({ slowMo, profileName }?: WalletProfileFixtureArgs) => _playwright_test.TestType<_playwright_test.PlaywrightTestArgs & _playwright_test.PlaywrightTestOptions & PhantomFixture, _playwright_test.PlaywrightWorkerArgs & _playwright_test.PlaywrightWorkerOptions & WorkerScopeFixture<Phantom>>;

export { Phantom, WalletProfileFixtureArgs, WorkerScopeFixture, phantomFixture, phantomWorkerScopeFixture };
