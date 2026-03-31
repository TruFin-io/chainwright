import { expect, type Page } from "@playwright/test";
import { switchAccount } from "./switch-account.metamask";

/**
 * By default, the last account will be selected. If you want to select a specific account, pass an `account` parameter.
 */
export async function connectToApp(page: Page, account?: string) {
    if (account) {
        await switchAccount({ page, accountName: account });
    }

    const connectButton = page.getByRole("button", { name: "Connect", exact: true });
    await connectButton.waitFor({ state: "visible", timeout: 25_000 });

    await connectButton.click();

    const connectingText = page.getByRole("heading", { name: "Connecting", exact: true });
    await connectingText.waitFor({ state: "detached", timeout: 30_000 });

    let isReviewPermissionsVisible: boolean | undefined;

    await expect
        .poll(
            async () => {
                const noticeDialog = page.locator("div[class='permissions-connect']");
                isReviewPermissionsVisible = await noticeDialog.isVisible().catch(() => false);
                return isReviewPermissionsVisible;
            },
            {
                timeout: 25_000,
            },
        )
        .toBe(true)
        .catch(() => console.error("Notice dialog did not appear within the timeout period."));

    const confirmButton = page.getByTestId("page-container-footer-next");
    await confirmButton.waitFor({ state: "visible", timeout: 25_000 });
    await confirmButton.click();
}
