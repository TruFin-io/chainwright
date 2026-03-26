import { expect, type Page } from "@playwright/test";
import { actionFooterSelectors } from "../selectors/action-footer";
import { switchAccount } from "./switch-account.petra";

/**
 * By default, the last account will be selected. If you want to select a specific account, pass `account` parameter.
 */
export async function connectToApp(page: Page, account?: string) {
    if (account) {
        await switchAccount(page, account);
    }

    const approveButton = page.locator(actionFooterSelectors.approveButton);
    await expect(approveButton).toBeEnabled({ timeout: 20_000 });
    await approveButton.click();
}
