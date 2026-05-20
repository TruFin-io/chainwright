import { expect } from "@playwright/test";
import { testWithPetraWorkerScope } from "@/tests/fixture/test-with-petra-fixture";
import { accountSelectors } from "@/wallets/petra/selectors/homepage-selectors.petra";

const test = testWithPetraWorkerScope;

test.describe("E2E For Adding account in Petra wallet", () => {
    test("Should add account via private key", async ({ workerScopeContents }) => {
        const { wallet: petra, walletPage: petraPage } = workerScopeContents;
        // PK --> Private Key
        const accountName = "PK account";

        await petra.addAccount({
            accountName,
            mode: "privateKey",
            privateKey: "ed25519-priv-0xd273e27a5f7ede39b8c2f4bde793fb949ecf5019007b5959b7683d5d53a1240f",
        });

        const accountMenuButton = petraPage.locator(accountSelectors.accountOptionsMenuButton).first();
        const menuButtonTextContent = await accountMenuButton.textContent();
        const splitValue = menuButtonTextContent?.split("Switch wallet")[1]?.split("0x")[0];

        expect(splitValue?.includes(accountName)).toBeTruthy();
    });

    test("Should add account via Mnemonic phrase", async ({ workerScopeContents }) => {
        const { wallet: petra, walletPage: petraPage } = workerScopeContents;
        // MP --> Mnemonic Phrase
        const accountName = "MP account";

        await petra.addAccount({
            accountName,
            mode: "mnemonic",
            mnemonicPhrase: "slam razor near morning edge across provide sting section bind soup differ",
        });

        const accountMenuButton = petraPage.locator(accountSelectors.accountOptionsMenuButton).first();
        const menuButtonTextContent = await accountMenuButton.textContent();
        const splitValue = menuButtonTextContent?.split("Switch wallet")[1]?.split("0x")[0];

        expect(splitValue?.includes(accountName)).toBeTruthy();
    });
});
