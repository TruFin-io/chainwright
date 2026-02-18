import { expect } from "@playwright/test";
import { testWithKeplrFixture } from "@/tests/fixture/test-with-keplr-fixture";

const test = testWithKeplrFixture;

test("Should get the account address successfully", async ({ keplr }) => {
    const ACCOUNT_ADDRESS = "inj1t7kfgeywkf8kat4xyj3jds4kq8fuew6xfjsuyy";
    const accountAddress = await keplr.getAccountAddress({
        chain: "Injective (Testnet)",
        walletName: "Default",
    });

    expect(accountAddress).toBe(ACCOUNT_ADDRESS);
});
