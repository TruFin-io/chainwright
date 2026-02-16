import { expect, type Page } from "@playwright/test";
import { settingsSelectors, unlockWalletSelectors } from "../selectors/homepage-selectors.metamask";
import { waitForMetaMaskLoad } from "../utils";
import { openSettings } from "./open-settings.metamask";

export async function lockWallet(page: Page) {
    const unlockButton = page.getByTestId(unlockWalletSelectors.unlockButton);
    const isUnlockButtonVisible = await unlockButton.isVisible().catch(() => false);

    if (isUnlockButtonVisible) {
        console.info("💡 Wallet is already locked");
        return;
    }

    await openSettings(page);
    const lockButton = page.getByTestId(settingsSelectors.lockButton);

    await expect(lockButton).toBeVisible();
    await lockButton.click();

    // Wait for the loading spinner to disappear.
    await waitForMetaMaskLoad(page);
}
