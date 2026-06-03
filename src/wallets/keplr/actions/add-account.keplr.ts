import type { Page } from "@playwright/test";
import type { AddAccountViaPrivateKey, AddAccountViaSeedPhrase } from "../types";
import { addWalletViaPrivateKey, addWalletViaSeedPhrase, goToOnboardingPage } from "../utils";

type AddAccount = (AddAccountViaPrivateKey | AddAccountViaSeedPhrase) & { page: Page };

export async function addAccount({ page, chains, walletName, mode, ...args }: AddAccount) {
    const onboardingPage = await goToOnboardingPage(page);

    if ("privateKey" in args) {
        await addWalletViaPrivateKey({ page: onboardingPage, privateKey: args.privateKey, walletName, chains, mode });
    }

    if ("seedPhrase" in args) {
        await addWalletViaSeedPhrase({ page: onboardingPage, seedPhrase: args.seedPhrase, walletName, chains, mode });
    }

    const backButtonContainer = page.locator("div:has(div:has-text('Select Wallet'))").nth(-4);
    const backButton = backButtonContainer.locator("div:has(> div > svg)").first();
    await backButton.click();

    const homeButton = page.getByRole("link", { name: "Home", exact: true });
    await homeButton.click();
}
