import type { Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";

export async function autoClosePhantomNotification(page: Page, isCancelled: () => boolean) {
    const INTERVAL = 300;
    let IS_POLLING_COMPLETE = false;

    while (!isCancelled()) {
        const _isCancelled = isCancelled();

        // Check if notification is closed
        // If it's closed or cancelled, there's no need to check again
        if (_isCancelled || IS_POLLING_COMPLETE || page.isClosed()) break;

        try {
            const notificationPopupBackButton = page.locator("div[id='modal']").locator("div > svg").first();
            const isNotificationButtonVisible = await notificationPopupBackButton.isVisible().catch(() => false);

            if (isNotificationButtonVisible) {
                await notificationPopupBackButton.click();
                IS_POLLING_COMPLETE = true;
            }
        } catch (error) {
            if (page.isClosed()) break;
            console.error("[autoClosePhantomNotification]: ", error);
        }

        // Check if polling is complete
        if (_isCancelled || IS_POLLING_COMPLETE || page.isClosed()) break;

        await sleep(INTERVAL);
    }
}
