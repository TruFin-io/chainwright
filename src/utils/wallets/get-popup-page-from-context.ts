import { type BrowserContext, expect, type Page } from "@playwright/test";

type GetPopupPageFromContextArgs = {
    context: BrowserContext;
    path: string;
    locator: string;
};

export async function getPopupPageFromContext({ context, path, locator }: GetPopupPageFromContextArgs) {
    let popupPage: Page | undefined;
    await expect
        .poll(
            async () => {
                popupPage = context.pages().find((page) => page.url().match(path));
                return !!popupPage;
            },
            {
                intervals: [1_000, 3_000, 5_000, 7_000, 10_000, 12_000, 15_000],
                timeout: 30_000,
            },
        )
        .toBe(true);

    if (!popupPage) {
        throw new Error(`Popup page with path ${path} not found in context.`);
    }

    await waitForStablePage(popupPage, locator);

    // Set pop-up window viewport size to resemble the actual Wallet's pop-up window.
    await popupPage.setViewportSize({
        width: 360,
        height: 592,
    });

    return popupPage;
}

async function waitForStablePage(page: Page, locator: string) {
    const TIMEOUT = 40_000;
    await page.waitForLoadState("load", { timeout: TIMEOUT });
    await page.waitForLoadState("domcontentloaded", { timeout: TIMEOUT });

    const domContent = page.locator(locator);
    await domContent.waitFor({ state: "attached", timeout: TIMEOUT });
}
