import type { Page } from "@playwright/test";
import type { {{WalletName}} } from "./{{walletName}}";

export type {{WalletName}}Fixture = {
    contextPath: string;
    {{walletName}}: {{WalletName}};
    {{walletName}}Page: Page;
};
