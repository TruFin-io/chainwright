import type { Page } from "@playwright/test";
import { meteorFixture } from "@/wallets/meteor";
import { meteorWorkerScopeFixture } from "@/wallets/meteor/meteor-worker-scope-fixture";
import { BASE_URL } from "../utils/base-url";

export const testWithMeteorFixture = meteorFixture();
export const testFixtureWithNetworkProfile = meteorFixture({ profileName: "multiple-network" });
export const testWithMeteorWorkerScope = meteorWorkerScopeFixture({
    dappUrl: `${BASE_URL}/near`,
});

export const testDappFixture = testWithMeteorFixture.extend<{
    dappPage: Page;
}>({
    dappPage: async ({ page, baseURL }, use) => {
        await page.goto(`${baseURL}/near`);
        await use(page);
    },
});
