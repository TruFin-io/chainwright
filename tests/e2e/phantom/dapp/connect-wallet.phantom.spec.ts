import { testDappFixture } from "@/tests/fixture/test-with-phantom-fixture";
import { connectWallet } from "../utils";

const test = testDappFixture;

test("Should connect wallet successfully", async ({ dappPage, phantom }) => {
    const navigation = dappPage.getByRole("navigation");
    await navigation.waitFor({ state: "attached", timeout: 15_000 });
    await connectWallet(dappPage, phantom);
});
