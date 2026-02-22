import { expect } from "@playwright/test";
import { testDappFixture } from "@/tests/fixture/test-with-meteor-fixture";
import { connectWallet } from "../utils";

const test = testDappFixture;

test("Should connect wallet successfully", async ({ dappPage, meteor }) => {
    const navigation = dappPage.getByRole("navigation");
    await navigation.waitFor({ state: "attached", timeout: 15_000 });
    await connectWallet(dappPage, meteor);

    const appConnectedButton = dappPage.getByTestId("wallet-connected-button");
    await expect(appConnectedButton).toBeVisible();
    expect(dappPage).toBeTruthy();
});
