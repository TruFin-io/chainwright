import { testWithWorkderScopeDappFixture } from "@/tests/fixture/test-with-meteor-fixture";
import { fillForm } from "@/tests/utils/transaction-form";
import { connectWallet } from "../utils";

const test = testWithWorkderScopeDappFixture;

test.describe("Confirm and reject transaction E2E tests", () => {
    test("Should confirm transaction successfully", async ({ dappPage, workerScopeContents }) => {
        const { wallet: meteor } = workerScopeContents;
        const navigation = dappPage.getByRole("navigation");
        await navigation.waitFor({ state: "attached", timeout: 15_000 });

        await connectWallet(dappPage, meteor);
        await fillForm({
            appPage: dappPage,
            walletAddress: "0xc74921a7033a1f6bf764ec907e4e5d8fa4567726f3cfe6c9a1185b44689e26e6",
            amount: "0.00001",
        });
        await meteor.confirmTransaction();
    });

    test("Should reject transaction successfully", async ({ dappPage, workerScopeContents }) => {
        const { wallet: meteor } = workerScopeContents;
        await connectWallet(dappPage, meteor);
        await fillForm({
            appPage: dappPage,
            walletAddress: "0xc74921a7033a1f6bf764ec907e4e5d8fa4567726f3cfe6c9a1185b44689e26e6",
            amount: "0.00001",
        });
        await meteor.rejectTransaction();
    });
});
