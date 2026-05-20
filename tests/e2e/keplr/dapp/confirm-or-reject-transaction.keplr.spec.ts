import { testWorkerScopeDappFixture } from "@/tests/fixture/test-with-keplr-fixture";
import { fillForm } from "@/tests/utils/transaction-form";

const test = testWorkerScopeDappFixture;

test.describe("Confirm and reject transaction E2E tests", () => {
    test("Should confirm transaction successfully", async ({ workerScopeContents, dappPage }) => {
        const { wallet: keplr } = workerScopeContents;
        const navigation = dappPage.getByRole("navigation");
        await navigation.waitFor({ state: "attached", timeout: 15_000 });

        const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
        await connectWalletButton.click();
        await keplr.connectToApp();

        await fillForm({
            appPage: dappPage,
            walletAddress: "inj1v8pdxua5vfmcq9pt47pavgm9044ahasw8kyrxw",
            amount: "0.01",
        });
        await keplr.confirmTransaction();
    });

    test("Should reject transaction successfully", async ({ workerScopeContents, dappPage }) => {
        const { wallet: keplr } = workerScopeContents;
        const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
        const isConnectWalletButtonVisible = await connectWalletButton.isVisible().catch(() => false);

        if (isConnectWalletButtonVisible) {
            console.info("\n Wallet is already connected");
            await connectWalletButton.click();
            await keplr.connectToApp();
        }

        await fillForm({
            appPage: dappPage,
            walletAddress: "inj1v8pdxua5vfmcq9pt47pavgm9044ahasw8kyrxw",
            amount: "0.01",
        });
        await keplr.rejectTransaction();
    });
});
