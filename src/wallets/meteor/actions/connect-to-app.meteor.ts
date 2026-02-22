import type { Page } from "@playwright/test";
import { popupPageSelectors } from "../selectors/popup-page-selectors.meteor";
import { switchAccount } from "./switch-account.meteor";
import { unlock } from "./unlock.meteor";

/**
 * By default, the last account will be selected. If you want to select a specific account, pass `account` parameter.
 */
export async function connectToApp(page: Page, account?: string) {
    await unlock(page);

    if (account) {
        await switchAccount(page, account);
    }

    const connectRequestHeading = page.getByRole("heading", { name: "Connect Request", exact: true });
    await Promise.all([
        page.locator(popupPageSelectors.connectButton).click(),
        connectRequestHeading.waitFor({ state: "detached", timeout: 30_000 }),
    ]);
}
