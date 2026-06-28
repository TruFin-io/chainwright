import { defineWalletSetup } from "chainwright/core";
import { Meteor } from "chainwright/meteor";

const PASSWORD = "test1234";
const PRIVATE_KEY = "Your private key";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const meteor = new Meteor(walletPage);

    await meteor.onboard({
        mode: "privateKey",
        privateKey: PRIVATE_KEY,
        accountName: "Default",
        network: "Testnet",
    });
});
