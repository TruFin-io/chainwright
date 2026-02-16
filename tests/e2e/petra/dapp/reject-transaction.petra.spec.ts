import { expect } from "@playwright/test";
import { testDappFixture } from "@/tests/fixture/test-with-petra-fixture";

const test = testDappFixture;

test("Should reject transaction successfully", async ({ dappPage, petra }) => {
    const connectWalletButton = dappPage.getByTestId("connect-wallet-button");
    await connectWalletButton.click();

    const dialog = dappPage.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const connectPetraButton = dialog.getByTestId("connect-wallet-Petra");
    await connectPetraButton.click();

    await petra.connectToApp();

    const appConnectedButton = dappPage.getByTestId("wallet-connected-button");
    await appConnectedButton.waitFor({ state: "attached", timeout: 30_000 });
    await expect(appConnectedButton).toBeVisible();

    const ADDRESS = "0xc74921a7033a1f6bf764ec907e4e5d8fa4567726f3cfe6c9a1185b44689e26e6";
    const addressInput = dappPage.locator("input[id='address']");
    const amountInput = dappPage.locator("input[id='amount']");
    const submitButton = dappPage.getByRole("button", { name: "Submit", exact: true });

    await addressInput.fill(ADDRESS);
    await amountInput.fill("0.0001");
    await submitButton.click();

    await petra.rejectTransaction();
});
