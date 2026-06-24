import { expect } from "@playwright/test";
import { testWithPetraWorkerScope } from "@/tests/fixture/test-with-petra-fixture";

const test = testWithPetraWorkerScope;

test.describe("Switch network E2E tests", () => {
    test("Should switch to Testnet network successfully", async ({ workerScopeContents }) => {
        const { wallet: petra, walletPage: petraPage } = workerScopeContents;
        await petra.switchNetwork("Devnet");

        const devnetPulse = petraPage.locator("div>span:has-text('Devnet')");
        const tokenTabButton = petraPage.locator("button[role='tab']:has-text('Tokens')");

        await expect(tokenTabButton).toBeVisible();
        await expect(tokenTabButton).toHaveText("Tokens");

        await expect(devnetPulse).toBeVisible();
        await expect(devnetPulse).toHaveText("Devnet");
    });
    test("Should switch to Mainnet network successfully", async ({ workerScopeContents }) => {
        const { wallet: petra, walletPage: petraPage } = workerScopeContents;
        const tokenTabButton = petraPage.locator("button[role='tab']:has-text('Tokens')");

        await petra.switchNetwork("Mainnet");

        await expect(tokenTabButton).toBeVisible();
        await expect(tokenTabButton).toHaveText("Tokens");
    });
});
