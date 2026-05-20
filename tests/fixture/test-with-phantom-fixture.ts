import type { Page } from "@playwright/test";
import { testWithChainwright } from "@/core/test-with-chainwright";
import { phantomFixture } from "@/wallets/phantom";
import { phantomWorkerScopeFixture } from "@/wallets/phantom/phantom-worker-scope-fixture";
import { BASE_URL } from "../utils/base-url";

export const testWithPhantomFixture = phantomFixture();
export const testWithPhantom = testWithChainwright(phantomFixture({}));

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithPhantom.extend<TestDappFixture>({
    dappPage: async ({ page, baseURL }, use) => {
        await page.goto(`${baseURL}/solana`);
        await use(page);
    },
});

export const testWithPhantomWorkerScopeDapp = phantomWorkerScopeFixture().extend<TestDappFixture>({
    dappPage: [
        async ({ workerScopeContents }, use) => {
            const { context } = workerScopeContents;
            const _dappPage = await context.newPage();
            await _dappPage.goto(`${BASE_URL}/solana`);
            await use(_dappPage);
        },
        { scope: "worker" },
    ],
});
