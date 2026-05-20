import type { Page } from "@playwright/test";
import { testWithChainwright } from "@/core/test-with-chainwright";
import { metamaskFixture } from "@/wallets/metamask/metamask-fixture";
import { metamaskWorkerScopeFixture } from "@/wallets/metamask/metamask-worker-scope-fixture";
import { BASE_URL } from "../utils/base-url";

export const testWithMetamaskFixture = metamaskFixture();
export const testWithMetamask = testWithChainwright(metamaskFixture());
export const testWithMetamaskWorkerScope = metamaskWorkerScopeFixture();

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithMetamask.extend<TestDappFixture>({
    dappPage: async ({ page, baseURL }, use) => {
        await page.goto(`${baseURL}/polygon`);
        await use(page);
    },
});

export const testWorkerScopeDappFixture = testWithMetamaskWorkerScope.extend<TestDappFixture>({
    dappPage: [
        async ({ workerScopeContents }, use) => {
            const { context } = workerScopeContents;
            const _dappPage = await context.newPage();
            await _dappPage.goto(`${BASE_URL}/polygon`);
            await use(_dappPage);
        },
        { scope: "worker" },
    ],
});
