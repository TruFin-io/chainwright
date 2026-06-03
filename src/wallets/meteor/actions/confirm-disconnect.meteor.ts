import type { Page } from "@playwright/test";
import { popupPageSelectors } from "../selectors/popup-page-selectors.meteor";
import { unlock } from "./unlock.meteor";

export async function confirmDisconnect(page: Page) {
    await unlock(page);

    const disconnectButton = page.locator(popupPageSelectors.logoutButton);
    await disconnectButton.click();
}
