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

        await expect(metamaskPage.getByTestId("app-header-logo").first()).toBeVisible();
        const networkButton = metamaskPage.getByTestId(homepageSelectors.openNetworkSelectorButton);
        await expect(networkButton).toContainText("Gnosis", { timeout: 15_000 });
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

        await expect(metamaskPage.getByTestId("app-header-logo").first()).toBeVisible();
        const networkButton = metamaskPage.getByTestId(homepageSelectors.openNetworkSelectorButton);
        await expect(networkButton).toContainText("Anvil Localnet", { timeout: 15_000 });
    });
});
