import { errors, expect, type Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";
import waitForStablePage from "@/utils/wait-for-stable-page";
import { loadingSelectors } from "./selectors/loading-selectors.metamask";

const TIMEOUT = 60_000;

export const waitForSelector = async (selector: string, page: Page, timeout: number) => {
    await waitForStablePage(page);

    try {
        const locator = page.locator(`div[class="${selector}"]`);
        await locator.waitFor({ state: "detached", timeout });
    } catch (error) {
        if (error instanceof errors.TimeoutError) {
            console.info(`Loading indicator '${selector}' not found - continuing.`);
        } else {
            console.error(`Error while waiting for loading indicator '${selector}' to disappear`);
            throw error;
        }
    }
};

export const waitForMetaMaskLoad = async (page: Page) => {
    try {
        // Then wait for all loading indicators to disappear
        await waitForSelector(loadingSelectors.loadingSpinner, page, TIMEOUT);
    } catch (error) {
        // Log error but don't fail - the page might be usable anyway
        console.warn("Warning during MetaMask load:", error);
    }

    // Add a small delay to ensure UI is fully ready
    await sleep(300);

    return page;
};

export async function ensureMetaMaskOnboardingCompleted(page: Page) {
    const extensionUrl = new URL(page.url());
    const extensionOrigin = `${extensionUrl.protocol}//${extensionUrl.host}`;
    const context = page.context();

    const serviceWorker =
        context.serviceWorkers().find((worker) => worker.url().startsWith(extensionOrigin)) ??
        (await context.waitForEvent("serviceworker", {
            predicate: (worker) => worker.url().startsWith(extensionOrigin),
            timeout: 60_000,
        }));

    await expect
        .poll(
            async () => {
                try {
                    return await serviceWorker.evaluate(
                        `(async () => {
                            const state = await chrome.storage.local.get([
                                "OnboardingController",
                                "KeyringController",
                                "PreferencesController",
                            ]);
                            const record = (value) => value && typeof value === "object" ? value : {};

                            const onboarding = record(state.OnboardingController);
                            const keyring = record(state.KeyringController);
                            const preferencesController = record(state.PreferencesController);
                            const preferences = record(preferencesController.preferences);

                            return (
                                onboarding.completedOnboarding === true &&
                                typeof keyring.vault === "string" &&
                                keyring.vault.length > 0 &&
                                preferences.showTestNetworks === true
                            );
                        })()`,
                    );
                } catch {
                    return false;
                }
            },
            {
                message: "MetaMask onboarding state was not persisted to extension storage",
                timeout: 60_000,
            },
        )
        .toBe(true);
}
