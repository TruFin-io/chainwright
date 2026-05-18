import type { Page } from "@playwright/test";
import type { Meteor } from "./meteor";

export type MeteorNetwork = "Mainnet" | "Testnet";

export type OnboardingArgs = {
    network: MeteorNetwork;
    privateKey: string;
    accountName: string;
    additionalAccounts?: Array<AddAccountArgs>;
};

export type RenameAccountArgs = {
    newAccountName: string;
};

export type AddAccountArgs = {
    privateKey: string;
    accountName: string;
    network: MeteorNetwork;
};

export type MeteorFixture = {
    contextPath: string;
    meteor: Meteor;
    meteorPage: Page;
};
