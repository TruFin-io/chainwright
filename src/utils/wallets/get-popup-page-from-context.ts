import { type BrowserContext, expect, type Page } from "@playwright/test";

type GetPopupPageFromContextArgs = {
    context: BrowserContext;
    path: string;
    locator: string;
};

export async function getPopupPageFromContext({ context, path, locator }: GetPopupPageFromContextArgs) {
    let popupPage: Page | undefined;
    try {
        await expect
            .poll(
                async () => {
                    popupPage = context
                        .pages()
                        .filter((_page) => _page.url().startsWith("chrome-extension://"))
                        .find((page) => page.url().match(path));
                    return !!popupPage;
                },
                {
                    timeout: 90_000,
                },
            )
            .toBe(true);
    } catch {
        const urls = context
            .pages()
            .filter((_page) => _page.url().startsWith("chrome-extension://"))
            .map((p) => p.url());
        throw new Error(
            [
                `Popup page with path "${path}" not found in context after 90s. `,
                `Pages in context: ${JSON.stringify(urls)}`,
            ].join("\n"),
        );
    }

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
    const TIMEOUT = 45_000;
    await page.waitForLoadState("load", { timeout: TIMEOUT });
    await page.waitForLoadState("domcontentloaded", { timeout: TIMEOUT });

    const domContent = page.locator(locator).first();
    await domContent.waitFor({ state: "attached", timeout: TIMEOUT });
}
