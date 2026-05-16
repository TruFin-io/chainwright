import type { Page } from "@playwright/test";
import { testWithChainwright } from "@/core/test-with-chainwright";
import { solflareFixture } from "@/wallets/solflare/solflare-fixture";
import { solflareWorkerScopeFixture } from "@/wallets/solflare/solflare-worker-scope-fixture";
import { BASE_URL } from "../utils/base-url";

export const testWithsolflareFixture = solflareFixture();
export const testWithSolflare = testWithChainwright(solflareFixture());
export const testWithSolflareWorkerScope = solflareWorkerScopeFixture({
    dappUrl: `${BASE_URL}/solana`,
});

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithSolflare.extend<TestDappFixture>({
    dappPage: async ({ page, baseURL }, use) => {
        await page.goto(`${baseURL}/solana`);
        await use(page);
    },
});
