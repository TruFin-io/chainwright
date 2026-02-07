import { expect } from "@playwright/test";
import { testWithPhantomFixture } from "@/tests/fixture/test-with-phantom-fixture";
import { menuSelectors } from "@/wallets/phantom/selectors/homepage-selectors.phantom";

const test = testWithPhantomFixture;

test("should rename the account successfully", async ({ phantom, phantomPage }) => {
    const CURRENT_ACCOUNT = "Foxtrot";
    const ACCOUNT_TO_RENAME = "Zebra";

    await phantom.renameAccount({ currentAccountName: CURRENT_ACCOUNT, newAccountName: ACCOUNT_TO_RENAME });
    await expect(phantomPage.getByTestId(menuSelectors.homeHeaderAccountName)).toContainText(ACCOUNT_TO_RENAME);
});
