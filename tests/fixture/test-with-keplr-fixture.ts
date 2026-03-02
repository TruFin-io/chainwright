import type { Page } from "@playwright/test";
import testWithChainwright from "@/core/test-with-chainwright";
import { keplrFixture } from "@/wallets/keplr/keplr-fixture";
import { keplrWorkerScopeFixture } from "@/wallets/keplr/keplr-worker-scope-fixture";

export const testWithKeplrFixture = keplrFixture();
export const testWithKeplr = testWithChainwright(keplrFixture());
export const testWithKeplrWorkerScope = keplrWorkerScopeFixture({
    dappUrl: "/injective",
});

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithKeplr.extend<TestDappFixture>({
    dappPage: async ({ page }, use) => {
        await page.goto("/injective");
        await use(page);
    },
});
