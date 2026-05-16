import type { Page } from "@playwright/test";
import { testWithChainwright } from "@/core/test-with-chainwright";
import { petraFixture } from "@/wallets/petra/petra-fixture";

export const testWithPetraFixture = petraFixture();
export const testWithPetra = testWithChainwright(petraFixture());

type TestDappFixture = {
    dappPage: Page;
};

export const testDappFixture = testWithPetra.extend<TestDappFixture>({
    dappPage: async ({ page, petra }, use) => {
        await petra.switchAccount("Echo");
        await petra.switchNetwork("Testnet");

        await page.goto("/aptos");
        await use(page);
    },
});
