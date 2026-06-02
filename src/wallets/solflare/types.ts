import type { Page } from "@playwright/test";
import z from "zod";
import type { Solflare } from "./solflare";

export type OnboardingArgs = {
    recoveryPhrase: string;
    walletName?: string;
    network?: "Mainnet" | "Devnet" | "Testnet";
    additionalAccounts?: Array<AddAccountArgs>;
};

export type SwitchNetwork = Omit<Required<OnboardingArgs>, "recoveryPhrase">["network"];

export const addAccountSchema = z.object({
    walletName: z.string().min(1, "Wallet name cannot be an empty string"),
    privateKey: z.string().min(1, "Private key cannot be an empty string"),
});

export type AddAccountArgs = z.infer<typeof addAccountSchema>;

export type RenameAccountArgs = {
    currentAccountName: string;
    newAccountName: string;
};

export type SolflareFixture = {
    contextPath: string;
    solflare: Solflare;
    solflarePage: Page;
    autoCloseNotification: undefined;
};
