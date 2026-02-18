import { expect } from "@playwright/test";
import { testWithKeplrFixture } from "@/tests/fixture/test-with-keplr-fixture";
import { KeplrProfile } from "@/wallets/keplr/keplr-profile";

const test = testWithKeplrFixture;

test("Should unlock wallet successfully", async ({ keplr, keplrPage }) => {
    await keplr.lock();

    const onboardingUrl = await new KeplrProfile().indexUrl();
    await keplrPage.goto(onboardingUrl);

    const welcomeBackText = keplrPage.getByText("Welcome Back");
    await expect(welcomeBackText).toBeVisible();

    await keplr.unlock();
});
