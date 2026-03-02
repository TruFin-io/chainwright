import type { Page } from "@playwright/test";
import testWithChainwright from "@/core/test-with-chainwright";
import { metamaskFixture } from "@/wallets/metamask/metamask-fixture";
import { metamaskWorkerScopeFixture } from "@/wallets/metamask/metamask-worker-scope-fixture";
import { BASE_URL } from "../utils/base-url";

export const testWithMetamaskFixture = metamaskFixture();
export const testWithMetamask = testWithChainwright(metamaskFixture());
export const testWithMetamaskWorkerScope = metamaskWorkerScopeFixture({
    dappUrl: `${BASE_URL}/polygon`,
});

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithMetamask.extend<TestDappFixture>({
    dappPage: async ({ page, baseURL }, use) => {
        await page.goto(`${baseURL}/polygon`);
        await use(page);
    },
});
