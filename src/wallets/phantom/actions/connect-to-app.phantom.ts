import { type Page, expect } from "@playwright/test";
import { actionFooterSelectors } from "../selectors/action-footers.phantom";
import { switchAccount } from "./switch-account.phantom";

/**
 * By default, the last account will be selected. If you want to select a specific account, pass `account` parameter.
 */
export async function connectToApp(page: Page, account?: string) {
    if (account) {
        await switchAccount(page, account);
    }

    const confirmButton = page.getByTestId(actionFooterSelectors.confirmButton);
    await expect(confirmButton).toBeEnabled({ timeout: 15_000 })
    await confirmButton.click()
}
