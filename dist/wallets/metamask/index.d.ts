import { W as WalletProfileFixtureArgs } from '../../types-aoLElQ63.js';
import { W as WorkerScopeFixture } from '../../worker-scope-context-DSkOcWf-.js';
export { w as workerScopeContext } from '../../worker-scope-context-DSkOcWf-.js';
import * as _playwright_test from '@playwright/test';
import { Page, BrowserContext } from '@playwright/test';
import z from 'zod';

type RenameAccount = {
    page: Page;
    currentAccountName: string;
    newAccountName: string;
};

declare class MetamaskProfile {
    readonly name: "metamask";
    readonly onboardingPath = "/home.html#onboarding";
    indexUrl(): Promise<string>;
    promptUrl(): Promise<string>;
    extensionId(): Promise<string>;
    promptPage(context: BrowserContext): Promise<_playwright_test.Page>;
}

type OnboardingArgs = {
    mode: "create";
    mainAccountName?: string;
} | {
    mode: "import";
    mainAccountName?: string;
    secretRecoveryPhrase: string;
};
type AddAccountArgs = {
    privateKey: string;
    accountName: string;
};
declare const addCustomNetworkSchema: z.ZodObject<{
    networkName: z.ZodString;
    rpcUrl: z.ZodURL;
    chainId: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    currencySymbol: z.ZodString;
}, z.core.$strip>;
type AddCustomNetwork = z.infer<typeof addCustomNetworkSchema>;
type SwitchNetwork = {
    chainName: "Ethereum" | "Base" | "Linea";
    networkType: "mainnet";
} | {
    chainName: "Sepolia" | "Linea Sepolia" | "Mega Testnet" | "Monad Testnet" | (string & {});
    networkType: "testnet" | "custom";
};
type GasFeeSettings = {
    feeType: "low" | "medium" | "high";
} | {
    feeType: "advanced";
    maxBaseFee: string;
    priorityFee: string;
};
type GetAccountAddressChains = "Ethereum" | "Tron" | "Bitcoin" | "Solana";
type AnvilNodeInstance = {
    host: string;
    port: number;
};
type CreateAnvilNodeResult = {
    rpcUrl: string;
    anvil: AnvilNodeInstance;
    chainId: number;
};
type MetamaskFixture = {
    contextPath: string;
    metamask: Metamask;
    metamaskPage: Page;
    createAnvilNode: (options?: AnvilNodeOptions) => Promise<CreateAnvilNodeResult>;
    connectToAnvil: () => Promise<void>;
};
/**
 * The options for creating an Anvil node.
 * They were extracted from the `Instance.anvil.Parameters` type because,
 * users were having a:
 * "The inferred type of 'X' cannot be named
 * without a reference to 'Parameters' from '../../../node_modules/prool/dist/Instance'.
 * This is likely not portable. A type annotation is necessary." error
 */
type AnvilNodeOptions = {
    /**
     * Number of dev accounts to generate and configure.
     *
     * @defaultValue 10
     */
    accounts?: number | undefined;
    /**
     * Set the Access-Control-Allow-Origin response header (CORS).
     *
     * @defaultValue *
     */
    allowOrigin?: string | undefined;
    /**
     * Enable autoImpersonate on startup
     */
    autoImpersonate?: boolean | undefined;
    /**
     * The balance of every dev account in Ether.
     *
     * @defaultValue 10000
     */
    balance?: number | bigint | undefined;
    /**
     * The base fee in a block.
     */
    blockBaseFeePerGas?: number | bigint | undefined;
    /**
     * Block time in seconds for interval mining.
     */
    blockTime?: number | undefined;
    /**
     * Path or alias to the Anvil binary.
     */
    binary?: string | undefined;
    /**
     * The chain id.
     */
    chainId?: number | undefined;
    /**
     * EIP-170: Contract code size limit in bytes. Useful to increase this because of tests.
     *
     * @defaultValue 0x6000 (~25kb)
     */
    codeSizeLimit?: number | undefined;
    /**
     * Sets the number of assumed available compute units per second for this fork provider.
     *
     * @defaultValue 350
     * @see https://github.com/alchemyplatform/alchemy-docs/blob/master/documentation/compute-units.md#rate-limits-cups
     */
    computeUnitsPerSecond?: number | undefined;
    /**
     * Writes output of `anvil` as json to user-specified file.
     */
    configOut?: string | undefined;
    /**
     * Sets the derivation path of the child key to be derived.
     *
     * @defaultValue m/44'/60'/0'/0/
     */
    derivationPath?: string | undefined;
    /**
     * Disable the `call.gas_limit <= block.gas_limit` constraint.
     */
    disableBlockGasLimit?: boolean | undefined;
    /**
     * Dump the state of chain on exit to the given file. If the value is a directory, the state will be
     * written to `<VALUE>/state.json`.
     */
    dumpState?: string | undefined;
    /**
     * Fetch state over a remote endpoint instead of starting from an empty state.
     *
     * If you want to fetch state from a specific block number, add a block number like `http://localhost:8545@1400000`
     * or use the `forkBlockNumber` option.
     */
    forkUrl?: string | undefined;
    /**
     * Fetch state from a specific block number over a remote endpoint.
     *
     * Requires `forkUrl` to be set.
     */
    forkBlockNumber?: number | bigint | undefined;
    /**
     * Specify chain id to skip fetching it from remote endpoint. This enables offline-start mode.
     *
     * You still must pass both `forkUrl` and `forkBlockNumber`, and already have your required state cached
     * on disk, anything missing locally would be fetched from the remote.
     */
    forkChainId?: number | undefined;
    /**
     * Specify headers to send along with any request to the remote JSON-RPC server in forking mode.
     *
     * e.g. "User-Agent: test-agent"
     *
     * Requires `forkUrl` to be set.
     */
    forkHeader?: Record<string, string> | undefined;
    /**
     * Initial retry backoff on encountering errors.
     */
    forkRetryBackoff?: number | undefined;
    /**
     * The block gas limit.
     */
    gasLimit?: number | bigint | undefined;
    /**
     * The gas price.
     */
    gasPrice?: number | bigint | undefined;
    /**
     * The EVM hardfork to use.
     */
    hardfork?: "Frontier" | "Homestead" | "Dao" | "Tangerine" | "SpuriousDragon" | "Byzantium" | "Constantinople" | "Petersburg" | "Istanbul" | "Muirglacier" | "Berlin" | "London" | "ArrowGlacier" | "GrayGlacier" | "Paris" | "Shanghai" | "Cancun" | "Prague" | "Latest" | undefined;
    /**
     * The host the server will listen on.
     */
    host?: string | undefined;
    /**
     * Initialize the genesis block with the given `genesis.json` file.
     */
    init?: string | undefined;
    /**
     * Launch an ipc server at the given path or default path = `/tmp/anvil.ipc`.
     */
    ipc?: string | undefined;
    /**
     * Initialize the chain from a previously saved state snapshot.
     */
    loadState?: string | undefined;
    /**
     * BIP39 mnemonic phrase used for generating accounts.
     */
    mnemonic?: string | undefined;
    /**
     * Automatically generates a BIP39 mnemonic phrase, and derives accounts from it.
     */
    mnemonicRandom?: boolean | undefined;
    /**
     * Disable CORS.
     */
    noCors?: boolean | undefined;
    /**
     * Disable auto and interval mining, and mine on demand instead.
     */
    noMining?: boolean | undefined;
    /**
     * Disables rate limiting for this node's provider.
     *
     * @defaultValue false
     * @see https://github.com/alchemyplatform/alchemy-docs/blob/master/documentation/compute-units.md#rate-limits-cups
     */
    noRateLimit?: boolean | undefined;
    /**
     * Explicitly disables the use of RPC caching.
     *
     * All storage slots are read entirely from the endpoint.
     */
    noStorageCaching?: boolean | undefined;
    /**
     * How transactions are sorted in the mempool.
     *
     * @defaultValue fees
     */
    order?: string | undefined;
    /**
     * Run an Optimism chain.
     */
    optimism?: boolean | undefined;
    /**
     * Port number to listen on.
     *
     * @defaultValue 8545
     */
    port?: number | undefined;
    /**
     * Don't keep full chain history. If a number argument is specified, at most this number of states is kept in memory.
     */
    pruneHistory?: number | undefined | boolean;
    /**
     * Number of retry requests for spurious networks (timed out requests).
     *
     * @defaultValue 5
     */
    retries?: number | undefined;
    /**
     * Don't print anything on startup and don't print logs.
     */
    silent?: boolean | undefined;
    /**
     * Slots in an epoch.
     */
    slotsInAnEpoch?: number | undefined;
    /**
     * Enable steps tracing used for debug calls returning geth-style traces.
     */
    stepsTracing?: boolean | undefined;
    /**
     * Interval in seconds at which the status is to be dumped to disk.
     */
    stateInterval?: number | undefined;
    /**
     * This is an alias for both `loadState` and `dumpState`. It initializes the chain with the state stored at the
     * file, if it exists, and dumps the chain's state on exit
     */
    state?: string | undefined;
    /**
     * Timeout in ms for requests sent to remote JSON-RPC server in forking mode.
     *
     * @defaultValue 45000
     */
    timeout?: number | undefined;
    /**
     * The timestamp of the genesis block.
     */
    timestamp?: number | bigint | undefined;
    /**
     * Number of blocks with transactions to keep in memory.
     */
    transactionBlockKeeper?: number | undefined;
};

declare class Metamask extends MetamaskProfile {
    page: Page;
    constructor(page: Page);
    /**
     * Onboards the wallet.
     * This function onboards the wallet by entering the password and other required information.
     * @param {OnboardingArgs} args - The arguments required for onboarding.
     * @param args.mode - Create a new wallet or import an existing wallet.
     * @param args.password - The password for the wallet.
     * @param args.secretRecoveryPhrase - The secret recovery phrase for the wallet when importing a wallet.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.onboard({ mode: "import", password: "password", secretRecoveryPhrase: "Recovery phrase" });
     */
    onboard(args: OnboardingArgs): Promise<void>;
    /**
     * Unlocks the wallet.
     * This function unlocks the wallet by entering the password.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.unlock()
     */
    unlock(): Promise<void>;
    /**
     * Locks the wallet.
     * This function opens the settings page and then locks the wallet.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.lock()
     */
    lock(): Promise<void>;
    /**
     * Renames an account.
     * @param {Omit<RenameAccount, "page">} args - The arguments to rename the account.
     * @param args.newAccountName - The new name of the account.
     * @param args.currentAccountName - The current name of the account.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.renameAccount({ newAccountName: "New Account Name", currentAccountName: "Current Account Name" });
     */
    renameAccount({ newAccountName, currentAccountName }: Omit<RenameAccount, "page">): Promise<void>;
    /**
     * Adds an account to the wallet via a private key.
     * @param {AddAccountArgs} args - The arguments to add the account.
     * @param args.privateKey - The private key of the account to add.
     * @param args.accountName - The name of the account to add.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.addAccount({ privateKey: "private key", accountName: "Account 1" });
     */
    addAccount({ privateKey, accountName }: AddAccountArgs): Promise<void>;
    /**
     * Switches the current account to the given account.
     * @param accountName - The name of the account to switch to.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.switchAccount("Account 1");
     */
    switchAccount(accountName: string): Promise<void>;
    /**
     * Switches the current network to the given network.
     * @param {SwitchNetwork} args - The arguments to switch the network.
     * @param args.networkType - It should be "testnet", "mainnet", and "custom".
     * @param args.chainName - (Mainnet): Ethereum, Base, Linea.
     * @param args.chainName - (Testnet): Sepolia, Linea Sepolia, Mega Testnet, Monad Testnet.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.switchNetwork({chainName: "Sepolia", networkType: "testnet"});
     */
    switchNetwork({ ...args }: SwitchNetwork): Promise<void>;
    /**
     * Gets the current account's address.
     * @returns The current account's address as a string.
     * @param netowrk - Get the address based on the network ("Bitcoin", "Ethereum", "Solana", "Tron")
     * @example
     * const metamask = new Metamask(page);
     * await metamask.getAccountAddress("Ethereum")
     */
    getAccountAddress(network: GetAccountAddressChains): Promise<string>;
    /**
     * Toggles the visibility of testnet networks in the wallet's network selector.
     * To persists the change, do it at the point of onboarding.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.toggleShowTestnetNetwork()
     */
    toggleShowTestnetNetwork(): Promise<void>;
    /**
     * Add a custom network to the wallet. If you want to persist the added wallet, do it at
     * the point of onboarding.
     * @param {AddCustomNetwork} options - an object containing the parameters for adding a custom network.
     * @param {number|string} options.chainId - the chain ID of the network.
     * @param {string} options.currencySymbol - the currency symbol of the network.
     * @param {string} options.networkName - the name of the network.
     * @param {string} options.rpcUrl - the RPC URL of the network.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.addCustomNetwork({chainId: 100, currencySymbol: "XDAI", networkName: "Gnosis", rpcUrl: "https://gnosis.oat.farm"});
     */
    addCustomNetwork({ chainId, currencySymbol, networkName, rpcUrl }: AddCustomNetwork): Promise<void>;
    /**
     * Connects to an app by clicking on the "Connect to app" button.
     * const metamask = new Metamask(page);
     * await metamask.connectToApp();
     */
    connectToApp(): Promise<void>;
    /**
     * Confirms a transaction in the wallet by clicking on the "Confirm" button.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.confirmTransaction();
     */
    confirmTransaction(gasFee?: GasFeeSettings): Promise<void>;
    /**
     * Cancels a transaction in the wallet by clicking on the "Cancel" button.
     * @example
     * const metamask = new Metamask(page);
     * await metamask.cancelTransaction();
     */
    rejectTransaction(): Promise<void>;
}

declare const metamaskFixture: ({ slowMo, profileName }?: WalletProfileFixtureArgs) => _playwright_test.TestType<_playwright_test.PlaywrightTestArgs & _playwright_test.PlaywrightTestOptions & MetamaskFixture, _playwright_test.PlaywrightWorkerArgs & _playwright_test.PlaywrightWorkerOptions>;

declare const metamaskWorkerScopeFixture: ({ profileName, slowMo }?: WalletProfileFixtureArgs) => _playwright_test.TestType<_playwright_test.PlaywrightTestArgs & _playwright_test.PlaywrightTestOptions & MetamaskFixture, _playwright_test.PlaywrightWorkerArgs & _playwright_test.PlaywrightWorkerOptions & WorkerScopeFixture<Metamask>>;

export { type AddAccountArgs, type AddCustomNetwork, type AnvilNodeInstance, type AnvilNodeOptions, type CreateAnvilNodeResult, type GasFeeSettings, type GetAccountAddressChains, Metamask, type MetamaskFixture, type OnboardingArgs, type SwitchNetwork, WalletProfileFixtureArgs, WorkerScopeFixture, addCustomNetworkSchema, metamaskFixture, metamaskWorkerScopeFixture };
