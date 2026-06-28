import { defineWalletSetup } from "chainwright/core";
import { Meteor } from "chainwright/meteor";

const PASSWORD = "test1234";
const DEFAULT_PRIVATE_KEY = "Your private key";
const TESTNET_PRIVATE_KEY = "Your private key";
const MAINNET_PRIVATE_KEY = "Your private key";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const meteor = new Meteor(walletPage);

    await meteor.onboard({
        mode: "privateKey",
        privateKey: DEFAULT_PRIVATE_KEY,
        accountName: "Default",
        network: "Testnet",
        additionalAccounts: [
            {
                mode: "privateKey",
                privateKey: TESTNET_PRIVATE_KEY,
                accountName: "Testnet account",
                network: "Testnet",
            },
            {
                mode: "privateKey",
                privateKey: MAINNET_PRIVATE_KEY,
                accountName: "Mainnet account",
                network: "Mainnet",
            },
        ],
    });
});
