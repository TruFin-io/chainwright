import { expect } from "@playwright/test";
import { testWithPhantomWorkerScopeDapp } from "@/tests/fixture/test-with-phantom-fixture";

const test = testWithPhantomWorkerScopeDapp;

test.describe("Phantom Get Account Address Test", () => {
    test("Should get the current account address for Ethereum", async ({ workerScopeContents }) => {
        const ACCOUNT_ADDRESS = "0x2983f6613cA0f3ab1049E3801CBb837226f154De";
        const { wallet: phantom } = workerScopeContents;
        await phantom.addAccount({
            accountName: "Ruka",
            chain: "Ethereum",
            privateKey: "0x28441de33adac31d474f08119cd1af56ddbdc77f111e9c7e186bb52c3bc2eceb",
        });

        const accountAddress = await phantom.getAccountAddress({
            accountName: "Ruka",
            chain: {
                mode: "testnet",
                network: "Sepolia",
            },
        });
        expect(accountAddress).toBe(ACCOUNT_ADDRESS);
    });

    test("Should get the current account address for Solana", async ({ workerScopeContents }) => {
        const { wallet: phantom } = workerScopeContents;
        const ACCOUNT_ADDRESS = "3EZLUndpNGpXxGNo1Fa44K6L7UVnXBXWk5kCuf2v5Wtw";

        await phantom.addAccount({
            accountName: "Solflare",
            chain: "Solana",
            privateKey: "2U1Q8ky5ayqEuoAq8uWntG2Fxrxj3B2irGHhBjH3zw3j75foYytCNSyZzbqcyLQDNKJeQE9YpeDVg319BfmJ8ktf",
        });

        const accountAddress = await phantom.getAccountAddress({
            accountName: "Solflare",
            chain: {
                mode: "testnet",
                network: "Devnet",
            },
        });
        expect(accountAddress).toBe(ACCOUNT_ADDRESS);
    });
});
