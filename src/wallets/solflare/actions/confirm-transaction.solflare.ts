import { expect, type Page } from "@playwright/test";
import { popupPageSelectors } from "../selectors/popup-page-selectors.solflare";

export async function confirmTransaction(page: Page) {
    const approveButton = page.getByTestId(popupPageSelectors.approveButton);
    const networkFeeSection = page.getByTestId("section-network-fee");
    await networkFeeSection.waitFor({ state: "attached", timeout: 30_000 }).catch(async () => {
        console.error(
            "Network fee section did not appear within the timeout period, which may indicate that the transaction confirmation popup did not load correctly.",
        );
        const errorTitle = page.getByText("Network mismatch", { exact: true });
        const isErrorTitleVisible = await errorTitle.isVisible().catch(() => false);
        if (isErrorTitleVisible) {
            const closeButton = page.getByRole("button", { name: "Close", exact: true });
            await closeButton.click();
            console.error(
                "A 'Network mismatch' error was detected in the popup. Closing the popup and aborting the transaction confirmation process.",
            );
        }
        return;
    });

    const controlLabelText = page.locator("div[data-id='control-label']");
    const isControlLabelTextVisible = await controlLabelText.isVisible().catch(() => false);

    if (isControlLabelTextVisible) {
        await controlLabelText.click();
    }

    await expect(approveButton).toBeEnabled();
    await approveButton.click();
}
