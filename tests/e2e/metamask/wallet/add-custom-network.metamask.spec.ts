import { expect } from "@playwright/test";
import { testWorkerScopeDappFixture } from "@/tests/fixture/test-with-metamask-fixture";
import { homepageSelectors } from "@/wallets/metamask/selectors/homepage-selectors.metamask";

const test = testWorkerScopeDappFixture;

test.describe("Add custom network", () => {
    test("Should add custom network successfully", async ({ workerScopeContents }) => {
        const { wallet: metamask, walletPage: metamaskPage } = workerScopeContents;
        await metamask.addCustomNetwork({
            networkName: "Gnosis",
            rpcUrl: "https://gnosis.oat.farm",
            chainId: 100,
            currencySymbol: "XDAI",
        });

        const networkButton = metamaskPage.getByTestId(homepageSelectors.openNetworkSelectorButton);
        await networkButton.click();

        const customTabSelector = metamaskPage.getByRole("tab", { name: "Custom" });
        await customTabSelector.click();

        const tabPanel = metamaskPage.getByRole("tabpanel").filter({ hasText: "Custom" });
        await expect(tabPanel).toContainText("Gnosis", { timeout: 15_000 });

        const modalCloseButton = metamaskPage.getByTestId("modal-header-close-button");
        await modalCloseButton.click();
    });

    test("Should add and connect to the local Anvil network successfully", async ({
        createAnvilNode,
        workerScopeContents,
    }) => {
        const { wallet: metamask, walletPage: metamaskPage } = workerScopeContents;
        const { chainId, rpcUrl } = await createAnvilNode({ chainId: 2251 });
        await metamask.addCustomNetwork({
            networkName: "Anvil Localnet",
            rpcUrl,
            chainId,
            currencySymbol: "ETH",
        });

        const networkButton = metamaskPage.getByTestId(homepageSelectors.openNetworkSelectorButton);
        await networkButton.click();

        const customTabSelector = metamaskPage.getByRole("tab", { name: "Custom" });
        await customTabSelector.click();

        const tabPanel = metamaskPage.getByRole("tabpanel").filter({ hasText: "Custom" });
        await expect(tabPanel).toContainText("Anvil Localnet", { timeout: 15_000 });

        const modalCloseButton = metamaskPage.getByTestId("modal-header-close-button");
        await modalCloseButton.click();
    });
});
