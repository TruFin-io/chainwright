import type { Page } from "@playwright/test";
import type { Petra } from "./petra";

export type OnboardingArgs =
    | {
          mode: "create";
          accountName: string;
          network: SwitchNetwork;
          additionalAccounts?: Array<AddAccount>;
      }
    | {
          mode: "importMnemonic";
          accountName: string;
          network: SwitchNetwork;
          secretRecoveryPhrase: string;
          additionalAccounts?: Array<AddAccount>;
      }
    | {
          mode: "importPrivateKey";
          accountName: string;
          network: SwitchNetwork;
          privateKey: string;
          additionalAccounts?: Array<AddAccount>;
      };

export type SwitchNetwork = "Mainnet" | "Testnet" | "Devnet" | "Shelbynet" | "Netna";

export type AddAccount =
    | {
          mode: "privateKey";
          accountName: string;
          privateKey: string;
      }
    | {
          mode: "mnemonic";
          accountName: string;
          mnemonicPhrase: string;
      };

export type PetraFixture = {
    contextPath: string;
    petra: Petra;
    petraPage: Page;
};
