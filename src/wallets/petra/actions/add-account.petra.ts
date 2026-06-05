import type { Page } from "@playwright/test";
import { accountSelectors } from "../selectors/homepage-selectors.petra";
import { onboardSelectors } from "../selectors/onboard-selectors.petra";
import type { AddAccount } from "../types";
import { renameAccount } from "./rename-account.petra";

export async function addAccount({ page, accountName, mode, ...args }: AddAccount & { page: Page }) {
    const accountMenuButton = page.locator(accountSelectors.accountOptionsMenuButton).first();
    await accountMenuButton.click();

    const accountsDialog = page.getByRole("dialog");
    const addAccountButton = accountsDialog.locator(accountSelectors.addAccountButton);
    await addAccountButton.click();

    if (mode === "privateKey") {
        const privateKey = "privateKey" in args ? args.privateKey : "";

        const importWithPrivateKeyButton = page.locator(accountSelectors.addAccountWithPrivateKeyButton);
        await importWithPrivateKeyButton.click();

        const privateKeyInput = page.locator(onboardSelectors.privateKeyInput);
        await privateKeyInput.fill(privateKey);

        const importButton = page.locator(onboardSelectors.importButton);
        await importButton.click();

        const toast = page.getByRole("status");
        const errorMessage = toast.locator("div[data-part='description']", {
            hasText: "Account already exists in wallet",
        });

        const errorMessageText = await errorMessage.textContent({ timeout: 3_000 }).catch(() => null);

        if (errorMessageText?.includes("Account already exists in wallet")) {
            throw Error(`Account ${accountName} already exists in wallet`);
        }

        await renameAccount({ page, newAccountName: accountName });
    }

    if (mode === "mnemonic") {
        const mnemonicPhrase = "mnemonicPhrase" in args ? args.mnemonicPhrase : "";
        const seedPhrase = mnemonicPhrase.split(" ");

        const importWithMnemonicPhraseButton = page.locator(accountSelectors.addAccountWithMnemonicButton);
        await importWithMnemonicPhraseButton.click();

        for (const [index, phrase] of seedPhrase.entries()) {
            const phraseInput = page.locator(
                `input[name="mnemonic-${String.fromCharCode("a".charCodeAt(0) + index)}"]`,
            );
            await phraseInput.fill(phrase);
        }

        const continueButton = page.locator(onboardSelectors.continueButton);
        await continueButton.click();

        const toast = page.getByRole("status");
        const errorMessage = toast.locator("div[data-part='description']", {
            hasText: "Account already exists in wallet",
        });

        const errorMessageText = await errorMessage.textContent({ timeout: 3_000 }).catch(() => null);

        if (errorMessageText?.includes("Account already exists in wallet")) {
            throw Error(`Account ${accountName} already exists in wallet`);
        }

        await renameAccount({ page, newAccountName: accountName });
    }
}
