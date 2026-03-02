import type { Page } from "@playwright/test";
import testWithChainwright from "@/core/test-with-chainwright";
import { keplrFixture } from "@/wallets/keplr/keplr-fixture";
import { keplrWorkerScopeFixture } from "@/wallets/keplr/keplr-worker-scope-fixture";
import { BASE_URL } from "../utils/base-url";

export const testWithKeplrFixture = keplrFixture();
export const testWithKeplr = testWithChainwright(keplrFixture());
export const testWithKeplrWorkerScope = keplrWorkerScopeFixture({
    dappUrl: `${BASE_URL}/injective`,
});

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithKeplr.extend<TestDappFixture>({
    dappPage: async ({ page, baseURL }, use) => {
        await page.goto(`${baseURL}/injective`);
        await use(page);
    },
});
