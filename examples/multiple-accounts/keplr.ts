import { defineWalletSetup } from "chainwright/core";
import { Keplr } from "chainwright/keplr";

const PASSWORD = "test1234";
const FIRST_PRIVATE_KEY = "Your private key";
const SECOND_PRIVATE_KEY = "Your private key";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const keplr = new Keplr(walletPage);

    await keplr.onboard([
        {
            mode: "privateKey",
            privateKey: FIRST_PRIVATE_KEY,
            walletName: "Default",
            chains: ["Injective", "Injective (Testnet)"],
        },
        {
            mode: "privateKey",
            privateKey: SECOND_PRIVATE_KEY,
            walletName: "Trading",
            chains: ["Injective", "Injective (Testnet)"],
        },
    ]);
});
