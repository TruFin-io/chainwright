import type { Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";

export async function autoCloseSolflareNotification(page: Page, isCancelled: () => boolean) {
    const INTERVAL = 150;
    let IS_POLLING_COMPLETE = false;

    while (!isCancelled()) {
        const _isCancelled = isCancelled();

        // Check if notification is closed
        // If it's closed or cancelled, there's no need to check again
        if (_isCancelled || IS_POLLING_COMPLETE || page.isClosed()) break;

        try {
            const notificationPopupCloseButton = page
                .locator("div[role='dialog']")
                .locator("button[data-testid='icon-btn-whats-new-modal-close']");

            const isNotificationPopupCloseButtonVisisble = await notificationPopupCloseButton
                .isVisible()
                .catch(() => false);

            if (isNotificationPopupCloseButtonVisisble) {
                await notificationPopupCloseButton.click();
                IS_POLLING_COMPLETE = true;
            }
        } catch (error) {
            console.error("[autoCloseSolflareNotification]: ", error);
        }

        if (_isCancelled || IS_POLLING_COMPLETE || page.isClosed()) break;

        await sleep(INTERVAL);
    }
}
