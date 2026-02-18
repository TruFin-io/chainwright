import { expect, type Page } from "@playwright/test";
import waitForStablePage from "@/utils/wait-for-stable-page";
import { KeplrProfile } from "../keplr-profile";
import type { AddAccountArgs } from "../types";
import { addWalletViaPrivateKey } from "../utils";

type AddAccount = AddAccountArgs & { page: Page };

export async function addAccount({ page, privateKey, chains, walletName, mode }: AddAccount) {
    const walletProfile = new KeplrProfile();
    const onboardingUrl = await walletProfile.onboardingUrl();

    const settingsButton = page.getByRole("link", { name: "Settings", exact: true });
    await settingsButton.click();

    const activeAccount = page.locator("div[cursor='pointer']").first();
    await activeAccount.click();

    const addWalletButton = page.getByRole("button", { name: "Add Wallet", exact: true });
    await addWalletButton.click();

    // Wait for the onboarding page to open in a new tab and switch to it.
    let onboardPage: Page | undefined;
    await expect
        .poll(
            async () => {
                onboardPage = page
                    .context()
                    .pages()
                    .find((page) => page.url().match(onboardingUrl));

                return !!onboardPage;
            },
            {
                timeout: 30_000,
            },
        )
        .toBe(true)
        .catch((error) => {
            console.error(
                `Failed to find onboarding page with URL matching ${onboardingUrl}. Original error: ${error}`,
            );
        });

    if (!onboardPage) {
        throw new Error(`Onboarding page not found. Expected URL: ${onboardingUrl}`);
    }

    await waitForStablePage(onboardPage);

    await onboardPage.bringToFront();
    await addWalletViaPrivateKey({ page: onboardPage, privateKey, walletName, chains, mode });

    const backButtonContainer = page.locator("div:has(div:has-text('Select Wallet'))").nth(-4);
    const backButton = backButtonContainer.locator("div:has(> div > svg)").first();
    await backButton.click();

    const homeButton = page.getByRole("link", { name: "Home", exact: true });
    await homeButton.click();
}
