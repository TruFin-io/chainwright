import { expect } from "@playwright/test";
import { testWithSolflareWorkerScopeDapp } from "@/tests/fixture/test-with-solflare-fixture";

const test = testWithSolflareWorkerScopeDapp;

test.describe("Switch network E2E tests", () => {
    test("Should successfully switch network to Devnet", async ({ workerScopeContents }) => {
        const { wallet: solflare, walletPage: solflarePage } = workerScopeContents;
        await solflare.switchNetwork("Devnet");

        const toasContainer = solflarePage.getByTestId("toast-container");
        const isToastContainerVisible = await toasContainer.isVisible().catch(() => false);

        if (isToastContainerVisible) {
            const toastMessage = toasContainer.locator("div[id='notistack-snackbar']");
            await expect(toastMessage).toHaveText(`Connected to Devnet`);
        }
    });

    test("Should successfully switch network to Testnet", async ({ workerScopeContents }) => {
        const { wallet: solflare, walletPage: solflarePage } = workerScopeContents;
        await solflare.switchNetwork("Testnet");

        const toasContainer = solflarePage.getByTestId("toast-container");
        const isToastContainerVisible = await toasContainer.isVisible().catch(() => false);

        if (isToastContainerVisible) {
            const toastMessage = toasContainer.locator("div[id='notistack-snackbar']");
            await expect(toastMessage).toHaveText(`Connected to Testnet`);
        }
    });

    test("Should successfully switch network to Mainnet", async ({ workerScopeContents }) => {
        const { wallet: solflare, walletPage: solflarePage } = workerScopeContents;
        await solflare.switchNetwork("Mainnet");
        const toasContainer = solflarePage.getByTestId("toast-container");
        const isToastContainerVisible = await toasContainer.isVisible().catch(() => false);

        if (isToastContainerVisible) {
            const toastMessage = toasContainer.locator("div[id='notistack-snackbar']");
            await expect(toastMessage).toHaveText(`Connected to Mainnet`);
        }
    });

    test("Should not switch if the network is already active", async ({ workerScopeContents }) => {
        const { wallet: solflare, walletPage: solflarePage } = workerScopeContents;
        await solflare.switchNetwork("Mainnet");

        const header = solflarePage.getByTestId("section-header");
        await expect(header).toContainText("Portfolio");
    });
});
