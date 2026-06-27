import { expect, type Page } from "@playwright/test";
import { popupPageSelectors } from "../selectors/popup-page-selectors.solflare";

export async function confirmTransaction(page: Page) {
    const approveButton = page.getByTestId(popupPageSelectors.approveButton);
    const networkFeeSection = page.getByTestId("section-network-fee");
    await networkFeeSection.waitFor({ state: "attached", timeout: 45_000 }).catch(() => false);

    const infoBoxNetworkMismatch = page.getByTestId("info-box-network-mismatch");
    const isInfoBoxNetworkMismatchVisible = await infoBoxNetworkMismatch.isVisible().catch(() => false);

    if (isInfoBoxNetworkMismatchVisible) {
        console.error(
            "\n \n A 'Network mismatch' error was detected in the transaction confirmation popup. Closing the popup and aborting the transaction confirmation process.",
        );
        const closeButton = page.getByRole("button", { name: "Close", exact: true });
        await closeButton.click();
        return;
    }

    const controlLabelText = page.locator("div[data-id='control-label']");
    const isControlLabelTextVisible = await controlLabelText.isVisible().catch(() => false);

    if (isControlLabelTextVisible) {
        await controlLabelText.click();
    }

    await expect(approveButton).toBeEnabled();
    await approveButton.click();
}
