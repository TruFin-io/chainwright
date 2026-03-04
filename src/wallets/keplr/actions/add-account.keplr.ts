import type { Page } from "@playwright/test";
import type { AddAccountArgs } from "../types";
import { addWalletViaPrivateKey, goToOnboardingPage } from "../utils";

type AddAccount = AddAccountArgs & { page: Page };

export async function addAccount({ page, privateKey, chains, walletName, mode }: AddAccount) {
    const onboardingPage = await goToOnboardingPage(page);
    await addWalletViaPrivateKey({ page: onboardingPage, privateKey, walletName, chains, mode });

    const backButtonContainer = page.locator("div:has(div:has-text('Select Wallet'))").nth(-4);
    const backButton = backButtonContainer.locator("div:has(> div > svg)").first();
    await backButton.click();

    const homeButton = page.getByRole("link", { name: "Home", exact: true });
    await homeButton.click();
}
