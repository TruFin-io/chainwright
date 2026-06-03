import type { Page } from "@playwright/test";

export async function getAccountAddress(page: Page) {
    const headerContainer = page.locator("div:has(button[type='button'][aria-label='open sidebar'])").nth(-2);
    const accountNameContainer = headerContainer.locator("div:has(div > h2)");
    const copyAddressButton = accountNameContainer.locator("div > svg");
    const copiedToast = page.locator(".chakra-toast").last();

    await copyAddressButton.click();
    await copiedToast.waitFor({ state: "visible", timeout: 5_000 });

    const address = await page.evaluate(async () => await navigator.clipboard.readText());
    await copiedToast.waitFor({ state: "hidden", timeout: 5_000 });

    return address;
}
