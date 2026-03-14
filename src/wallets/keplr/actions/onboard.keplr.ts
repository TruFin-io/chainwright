import { styleText } from "node:util";
import { expect, type Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import { homepageSelectors } from "../selectors/homepage-selectors.keplr";
import type { OnboardingArgs } from "../types";
import { addWalletViaPrivateKey, goToOnboardingPage } from "../utils";
import { switchAccount } from "./switch-account.keplr";

type Onboard = { onboard: OnboardingArgs } & { page: Page };

export default async function onboard({ page, onboard }: Onboard) {
    console.info(styleText("yellowBright", `\n Keplr onboarding started...`, { validateStream: false }));

    if (onboard.length === 1) {
        for (const { privateKey, walletName, chains } of onboard) {
            await addWalletViaPrivateKey({
                page,
                privateKey,
                walletName,
                chains,
                mode: "onboard",
            });
        }
    }

    if (onboard.length > 1) {
        // Onboard the first wallet normally
        const initalWallet = onboard[0];

        if (initalWallet) {
            const { privateKey, walletName, chains } = initalWallet;
            await addWalletViaPrivateKey({
                page,
                privateKey,
                walletName,
                chains,
                mode: "onboard",
            });
        }

        const accountsToAdd = onboard.slice(1);
        for (const { privateKey, walletName, chains } of accountsToAdd) {
            const onboardingPage = await goToOnboardingPage(page);
            await addWalletViaPrivateKey({
                page: onboardingPage,
                privateKey,
                walletName,
                chains,
                mode: "add-account-single",
            });
        }

        const headingContainer = page.locator("div", { hasText: "Select Wallet" }).last().locator("../../..");
        const backButton = headingContainer.locator("div > svg");
        await backButton.click();

        const homeButton = page.getByRole("link", { name: "Home", exact: true });
        await homeButton.click();

        const openMenuButton = page.locator(homepageSelectors.openSidebarMenuButton);
        await expect(openMenuButton).toBeVisible({ timeout: 30_000 });

        const currentAccountName = onboard.at(-1)?.walletName;
        const accountToSwitchTo = onboard[0]?.walletName;

        if (currentAccountName && accountToSwitchTo) {
            await switchAccount(page, accountToSwitchTo);
        }
    }

    await sleep(3_000);
    console.info(styleText("greenBright", "✨ Keplr onboarding completed successfully", { validateStream: false }));
}
