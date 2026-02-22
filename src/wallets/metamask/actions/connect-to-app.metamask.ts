import { expect, type Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import { accountSelectors } from "../selectors/homepage-selectors.metamask";
import { switchAccount } from "./switch-account.metamask";

/**
 * By default, the last account will be selected. If you want to select a specific account, pass an `account` parameter.
 */
export async function connectToApp(page: Page, account?: string) {
    /**
     * Grant permission to all accounts in the wallet.
     * This is the first step so that we can easily switch to any desired account later.
     * With this approach, we can switch accounts during a test session.
     */
    const editAccountsButton = page.getByTestId("edit");
    await editAccountsButton.click();

    const addWalletButton = page.getByTestId(accountSelectors.addMultichainAccountButton);
    const startTextContent = await addWalletButton.textContent();
    if (startTextContent?.includes("Syncing")) {
        await expect
            .poll(async () => (await addWalletButton.textContent())?.trim() ?? "", { timeout: 60_000 })
            .not.toBe(startTextContent);
    }

    const allAccounts = await page.locator("div[data-testid^='multichain-account-cell-entropy']").all();
    for (const _account of allAccounts) {
        const label = _account.locator("label > span > span");
        const isLabelVisible = await label.isVisible().catch(() => false);
        if (!isLabelVisible) {
            await _account.click();
        }
    }

    const connectMoreAccountsButton = page.getByTestId("connect-more-accounts-button");
    await expect(connectMoreAccountsButton).toBeVisible();
    await connectMoreAccountsButton.click();

    if (account) {
        await switchAccount({ page, accountName: account });
    }

    const connectButton = page.getByRole("button", { name: "Connect", exact: true });
    await connectButton.waitFor({ state: "visible", timeout: 25_000 });
    await connectButton.click();

    const connectingText = page.getByRole("heading", { name: "Connecting", exact: true });
    await connectingText.waitFor({ state: "detached", timeout: 25_000 });

    let isNoticeDialogVisible: boolean | undefined;

    await expect
        .poll(
            async () => {
                const noticeDialog = page.getByRole("dialog");
                isNoticeDialogVisible = await noticeDialog.isVisible().catch(() => false);
                return isNoticeDialogVisible;
            },
            {
                timeout: 25_000,
            },
        )
        .toBe(true)
        .catch(() => console.error("Notice dialog did not appear within the timeout period."));

    if (isNoticeDialogVisible) {
        const snapPrivacyScrollButton = page.getByTestId("snap-privacy-warning-scroll");
        const acceptButton = page.getByRole("button", { name: "Accept", exact: true });

        await snapPrivacyScrollButton.click();
        await snapPrivacyScrollButton.waitFor({ state: "detached", timeout: 30_000 });

        await expect(acceptButton).toBeEnabled({ timeout: 30_000 });
        await acceptButton.click();
    }

    const confirmButton = page.getByTestId("page-container-footer-next");
    await confirmButton.waitFor({ state: "visible", timeout: 25_000 });
    await confirmButton.click();

    await sleep(2_000);
}
