import type { Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import { actionFooterSelectors } from "../selectors/action-footer";
import { humanize } from "../utils";

async function checkForError(page: Page, isFinished: () => boolean) {
    const INTERVAL = 300;

    while (true) {
        const _isFinished = isFinished();
        if (_isFinished || page.isClosed()) break;

        try {
            const errorContainer = page.locator("div:has(> h2:has-text('Simulation error'))");
            const isErrorContainerVisible = await errorContainer.isVisible().catch(() => false);

            if (isErrorContainerVisible) {
                const errorText = await errorContainer.locator("p").textContent();
                throw new Error(
                    `[Confirm Transaction Error]: ${humanize(errorText ? errorText : "Unexpected error!")}`,
                );
            }
        } catch (error) {
            if (page.isClosed()) break;
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`[Confirm Transaction Error]: ${error}`);
        }

        // Check if polling is complete
        if (_isFinished || page.isClosed()) break;

        await sleep(INTERVAL);
    }
}

export async function confirmTransaction(page: Page) {
    // Check for any simulation error
    let isFinished = false;
    const _isFinished = () => isFinished;
    checkForError(page, _isFinished).catch(async (error) => {
        if (!page.isClosed()) {
            console.error((error as Error).message);
        }
    });

    const approveButton = page.locator(actionFooterSelectors.approveButton);

    await approveButton.click();
    isFinished = true;
}
