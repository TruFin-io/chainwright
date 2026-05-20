import type { Page } from "@playwright/test";
import { testWithChainwright } from "@/core/test-with-chainwright";
import { keplrFixture } from "@/wallets/keplr/keplr-fixture";
import { keplrWorkerScopeFixture } from "@/wallets/keplr/keplr-worker-scope-fixture";
import { BASE_URL } from "../utils/base-url";

export const testWithKeplrFixture = keplrFixture();
export const testWithKeplr = testWithChainwright(keplrFixture());

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithKeplr.extend<TestDappFixture>({
    dappPage: async ({ page, baseURL }, use) => {
        await page.goto(`${baseURL}/injective`);
        await use(page);
    },
});

export const testWorkerScopeDappFixture = keplrWorkerScopeFixture().extend<TestDappFixture>({
    dappPage: [
        async ({ workerScopeContents }, use) => {
            const { context } = workerScopeContents;
            const _dappPage = await context.newPage();
            await _dappPage.goto(`${BASE_URL}/injective`);
            await use(_dappPage);
        },
        { scope: "worker" },
    ],
});
