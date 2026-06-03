import type { Page } from "@playwright/test";
import type { Meteor } from "./meteor";

export type MeteorNetwork = "Mainnet" | "Testnet";

type SharedOnboardArgs = {
    network: MeteorNetwork;
    accountName: string;
    additionalAccounts?: Array<AddAccountArgs>;
};

export type OnboardingArgs = (
    | {
          mode: "privateKey";
          privateKey: string;
      }
    | {
          mode: "secretPhrase";
          secretPhrase: string;
      }
) &
    SharedOnboardArgs;

export type RenameAccountArgs = {
    newAccountName: string;
};

type AddAccountCommonArgs = {
    accountName: string;
    network: MeteorNetwork;
};

export type AddAccountArgs = (
    | {
          privateKey: string;
          mode: "privateKey";
      }
    | {
          secretPhrase: string;
          mode: "secretPhrase";
      }
) &
    AddAccountCommonArgs;

export type MeteorFixture = {
    contextPath: string;
    meteor: Meteor;
    meteorPage: Page;
};
