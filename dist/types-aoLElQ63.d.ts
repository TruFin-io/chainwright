import { BrowserContext, Page } from '@playwright/test';

type CLIOptions = "metamask" | "solflare" | "petra" | "phantom" | "meteor" | "keplr" | "all";
type SupportedWallets = Exclude<CLIOptions, "all">;
type Args = {
    context: BrowserContext;
    walletPage: Page;
};
type WalletSetupFunction = ({ context, walletPage }: Args) => Promise<void>;
type ExtensionSource = {
    localPath: string;
} | {
    downloadUrl: string;
    sha256: string;
};
type WalletSetupConfig = {
    profileName?: string;
    slowMo?: number;
    extensionSource?: ExtensionSource;
};
type WalletProfileFixtureArgs = {
    slowMo?: number;
    profileName?: string;
};

export type { SupportedWallets as S, WalletProfileFixtureArgs as W, WalletSetupConfig as a, WalletSetupFunction as b };
