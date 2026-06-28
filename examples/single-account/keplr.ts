import { defineWalletSetup } from "chainwright/core";
import { Keplr } from "chainwright/keplr";

const PASSWORD = "test1234";
const PRIVATE_KEY = "Your private key";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const keplr = new Keplr(walletPage);

    await keplr.onboard([
        {
            mode: "privateKey",
            privateKey: PRIVATE_KEY,
            walletName: "Default",
            chains: ["Injective", "Injective (Testnet)"],
        },
    ]);
});
