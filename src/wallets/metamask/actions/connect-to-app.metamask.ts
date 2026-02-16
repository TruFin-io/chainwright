import { expect, type Locator, type Page } from "@playwright/test";
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
    // const editAccountsButton = page.getByTestId("edit");
    // await editAccountsButton.click();

    // console.log("Edit accounts button clicked");

    // const addWalletButton = page.getByTestId(accountSelectors.addMultichainAccountButton);
    // const startTextContent = await addWalletButton.textContent();
    // if (startTextContent?.includes("Syncing")) {
    //     await expect
    //         .poll(async () => (await addWalletButton.textContent())?.trim() ?? "", { timeout: 60_000 })
    //         .not.toBe(startTextContent);
    // }

    // const allAccounts = await page.locator("div[data-testid^='multichain-account-cell-entropy']").all();
    // for (const _account of allAccounts) {
    //     const label = _account.locator("label > span > span");
    //     const isLabelVisible = await label.isVisible().catch(() => false);
    //     if (!isLabelVisible) {
    //         await _account.click();
    //     }
    // }

    // console.log("All accounts have been selected!");

    // const connectMoreAccountsButton = page.getByTestId("connect-more-accounts-button");
    // await expect(connectMoreAccountsButton).toBeVisible();
    // await connectMoreAccountsButton.click();

    // console.log("Connect more accounts button clicked");

    if (account) {
        await switchAccount({ page, accountName: account });
    }

    const connectButton = page.getByRole("button", { name: "Connect", exact: true });
    await connectButton.waitFor({ state: "visible", timeout: 30_000 });
    await connectButton.click();

    console.log("Connect button clicked!");

    // Wait for any popup to show
    await sleep(10_000);

    const noticeDialog = page.getByRole("dialog");
    const isNoticeDialogVisible = await noticeDialog.isVisible().catch(() => false);
    console.log("Polling for notice dialog visibility...", { isNoticeDialogVisible });
    if (isNoticeDialogVisible) {
        console.log("Notice dialog is available....");
        const snapPrivacyScrollButton = page.getByTestId("snap-privacy-warning-scroll");
        const acceptButton = page.getByRole("button", { name: "Accept", exact: true });

        await snapPrivacyScrollButton.click();
        await snapPrivacyScrollButton.waitFor({ state: "detached", timeout: 30_000 });

        await expect(acceptButton).toBeEnabled({ timeout: 30_000 });
        await acceptButton.click();
    }

    // await expect
    //     .poll(
    //         async () => {
    //             const noticeDialog = page.getByRole("dialog");
    //             const isNoticeDialogVisible = await noticeDialog.isVisible().catch(() => false);
    //             console.log("Polling for notice dialog visibility...", { isNoticeDialogVisible });
    //             if (isNoticeDialogVisible) {
    //                 console.log("Notice dialog is available....");
    //                 const snapPrivacyScrollButton = page.getByTestId("snap-privacy-warning-scroll");
    //                 const acceptButton = page.getByRole("button", { name: "Accept", exact: true });

    //                 await snapPrivacyScrollButton.click();
    //                 await snapPrivacyScrollButton.waitFor({ state: "detached", timeout: 30_000 });

    //                 await expect(acceptButton).toBeEnabled({ timeout: 30_000 });
    //                 await acceptButton.click();
    //             }

    //             return isNoticeDialogVisible;
    //         },
    //         {
    //             timeout: 30_000,
    //         },
    //     )
    //     .toBe(true)
    //     .catch(() => console.log("Notice dialog did not appear within the timeout period."));

    // console.log("After the polling...");

    // const noticeDialog = page.getByRole("dialog");
    // const isNoticeDialogVisible = await noticeDialog.isVisible().catch(() => false);

    // const reviewPermissionsHeading = page.getByRole("heading", { name: "Review permissions" });
    // await reviewPermissionsHeading.waitFor({ state: "visible", timeout: 30_000 });

    console.log("It got here!!!!");
    const confirmButton = page.getByRole("button", { name: "Confirm", exact: true });
    await expect(confirmButton).toBeEnabled({ timeout: 30_000 });
    await confirmButton.click();

    console.log("Confirm button clicked!");

    await page.waitForEvent("close", { timeout: 30_000 }).then(() => console.log("Popup closed!"));
}
