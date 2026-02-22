import { testWithPhantomFixture } from "@/tests/fixture/test-with-phantom-fixture";

const test = testWithPhantomFixture;

test("Should unlock wallet successfully", async ({ phantom, phantomPage }) => {
    await phantom.lock();

    const enterYourPasswordText = phantomPage.getByText("Enter your password");
    await enterYourPasswordText.waitFor({ state: "attached" });

    await phantom.unlock();
});
