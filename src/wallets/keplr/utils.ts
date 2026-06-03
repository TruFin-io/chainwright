import { expect, type Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import waitForStablePage from "@/utils/wait-for-stable-page";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";
import { KeplrProfile } from "./keplr-profile";
import { onboardingSelectors } from "./selectors/onboard-selectors.keplr";
import type { AddAccount, AddAccountViaPrivateKey, AddAccountViaSeedPhrase } from "./types";

type AddWalletViaPrivateKey = AddAccountViaPrivateKey & {
    page: Page;
};

type AddWalletViaSeedPhrase = AddAccountViaSeedPhrase & {
    page: Page;
};

function escapeRegExp(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function addWalletViaPrivateKey({
    page,
    privateKey,
    walletName,
    chains,
    mode = "onboard",
}: AddWalletViaPrivateKey) {
    const importExistingWalletButton = page.locator(onboardingSelectors.importExistingWalletButton);
    await importExistingWalletButton.click();

    const usePrivateKeyButton = page.locator(onboardingSelectors.usePrivateKeyButton);
    await usePrivateKeyButton.click();

    const privateKeyTabButton = page.getByRole("button", { name: "Private key", exact: true });
    await privateKeyTabButton.click();

    const privateKeyInput = page.locator(onboardingSelectors.privateKeyInput);
    await privateKeyInput.fill(privateKey);

    await addAccountFlow({
        page,
        walletName,
        mode,
        chains,
    });
}

export async function addWalletViaSeedPhrase({
    page,
    seedPhrase,
    walletName,
    chains,
    mode = "onboard",
}: AddWalletViaSeedPhrase) {
    const importExistingWalletButton = page.locator(onboardingSelectors.importExistingWalletButton);
    await importExistingWalletButton.click();

    const usePrivateKeyButton = page.locator(onboardingSelectors.usePrivateKeyButton);
    await usePrivateKeyButton.click();

    const seedPhraseTabButton = page.getByRole("button", { name: "12 words", exact: true });
    await seedPhraseTabButton.click();

    const seedPhraseInput = page.locator("input[type='password']");
    const _seedPhrase = seedPhrase.split(" ");

    await seedPhraseInput.first().fill(_seedPhrase[0] as string);
    await seedPhraseInput.first().press("Tab");

    for (let i = 1; i < _seedPhrase.length; i++) {
        const seedPhraseElement = seedPhraseInput.nth(i);
        const seedPhraseText = _seedPhrase[i];

        await seedPhraseElement.fill(seedPhraseText as string);

        if (i < _seedPhrase.length - 1) {
            await seedPhraseElement.press("Tab");
        }
    }

    await addAccountFlow({
        page,
        walletName,
        mode,
        chains,
    });
}

type AddAccountFlow = {
    page: Page;
    walletName: string;
    mode: AddAccount["mode"];
    chains: AddAccount["chains"];
};

async function addAccountFlow({ page, walletName, mode, chains }: AddAccountFlow) {
    const walletProfile = new KeplrProfile();
    const PASSWORD = await getWalletPasswordFromCache("keplr");

    const importButton = page.getByRole("button", { name: "Import", exact: true });
    await importButton.click();

    const walletNameInput = page.locator(onboardingSelectors.walletNameInput);
    await walletNameInput.fill(walletName);

    if (mode === "onboard") {
        const walletPasswordInput = page.locator(onboardingSelectors.walletPasswordInput);
        const confirmPasswordInput = page.locator(onboardingSelectors.confirmWalletPasswordInput);

        await walletPasswordInput.fill(PASSWORD);
        await confirmPasswordInput.fill(PASSWORD);
    }

    const nextButton = page.locator(onboardingSelectors.nextButton);
    await nextButton.click();

    const allNativeChains = page.locator("div:has-text('All Native Chains')").nth(-4);
    const cosmosHubChain = page.locator("div[cursor='pointer']:has-text('Cosmos Hub')");
    const allNativeChainsCheckbox = await allNativeChains.locator("input[type='checkbox']").getAttribute("checked");
    const cosmosHubChainCheckbox = await cosmosHubChain.locator("input[type='checkbox']").getAttribute("checked");

    // Uncheck "All Native Chains" and "Cosmos Hub"
    if (allNativeChainsCheckbox !== null) await allNativeChains.click();
    if (cosmosHubChainCheckbox !== null) await cosmosHubChain.click();

    const searchNetworkInput = page.locator(onboardingSelectors.searchNetworkInput);

    for (const chain of chains) {
        await searchNetworkInput.fill(chain);

        const chainsContainer = page.locator("div[class='simplebar-content']");
        const currentChain = chainsContainer
            .locator(`div[cursor] > div`)
            .first()
            .locator("div")
            .filter({
                hasText: new RegExp(`^${escapeRegExp(chain)}$`, "i"),
            })
            .nth(2)
            .locator("../../../../..");

        await currentChain.waitFor({ state: "visible", timeout: 20_000 });
        const isCurrentChainChecked = await currentChain.locator("input[type='checkbox']").getAttribute("checked");

        // If the current chain is not checked, check it.
        if (isCurrentChainChecked === null) {
            await currentChain.click();
        }
    }

    const saveButton = page.locator(onboardingSelectors.saveButton);
    await saveButton.scrollIntoViewIfNeeded();
    await saveButton.click();

    // Delay to ensure that the selected chains are saved before proceeding.
    await sleep(2_000);

    if (mode === "onboard") {
        await page.goto(await walletProfile.indexUrl());
        return;
    }

    if (mode === "add-account-single") {
        const finishButton = page.locator(onboardingSelectors.finishButton);
        await finishButton.waitFor({ state: "visible", timeout: 20_000 });
        await expect(finishButton).toBeEnabled({ timeout: 20_000 });
        await finishButton.click();
    }
}

export async function goToOnboardingPage(page: Page) {
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

    return onboardPage;
}
