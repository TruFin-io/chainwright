import { expect, type Page } from "@playwright/test";
import { homepageSelectors, settingsSelectors } from "../selectors/homepage-selectors.metamask";

export async function toggleShowTestnetNetwork({ page }: { page: Page }) {
    const settingsButton = page.locator(`div:has(> button[data-testid='${homepageSelectors.openSettingsButton}'])`);
    await settingsButton.click();

    const networksButton = page.getByTestId(settingsSelectors.networksButton);
    await networksButton.click();

    const networksDialog = page.getByTestId("networks-page-list");
    await expect(networksDialog).toBeVisible();
    await expect(networksDialog).toContainText(/networks/i);

    const networkSwitchToggle = "div:has(> p:has-text('Show test networks'))";
    await networksDialog.locator(networkSwitchToggle).scrollIntoViewIfNeeded();

    const showTestnetNetworkToggle = networksDialog.locator(networkSwitchToggle);
    const isNetworkSwitchOffToggleVisible = await showTestnetNetworkToggle
        .locator("label[class='toggle-button toggle-button--off']")
        .isVisible()
        .catch(() => false);

    const headerBackButton = page.getByTestId("settings-header-back-button");
    const drawerCloseButton = page.getByTestId("drawer-close-button");

    if (!isNetworkSwitchOffToggleVisible) {
        await headerBackButton.click();
        await drawerCloseButton.click();
        console.info("Testnet networks are already visible.");
        return;
    }

    await showTestnetNetworkToggle.locator("label[class='toggle-button toggle-button--off']").click();

    await page.getByTestId("Sepolia").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("Sepolia")).toBeVisible();

    await headerBackButton.click();
    await drawerCloseButton.click();
}
