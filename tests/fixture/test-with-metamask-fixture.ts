import type { Page } from "@playwright/test";
import testWithChainwright from "@/core/test-with-chainwright";
import { metamaskFixture } from "@/wallets/metamask/metamask-fixture";
import { metamaskWorkerScopeFixture } from "@/wallets/metamask/metamask-worker-scope-fixture";

export const testWithMetamaskFixture = metamaskFixture();
export const testWithMetamask = testWithChainwright(metamaskFixture());
export const testWithMetamaskWorkerScope = metamaskWorkerScopeFixture({
    dappUrl: "/polygon",
});

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithMetamask.extend<TestDappFixture>({
    dappPage: async ({ page }, use) => {
        await page.goto("/polygon");
        await use(page);
    },
});
