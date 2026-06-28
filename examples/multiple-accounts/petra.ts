import { defineWalletSetup } from "chainwright/core";
import { Petra } from "chainwright/petra";

const PASSWORD = "PlayerPetra45!!";
const SECRET_RECOVERY_PHRASE = "Your secret phrase";
const SECOND_PRIVATE_KEY = "Your private key";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const petra = new Petra(walletPage);

    await petra.onboard({
        mode: "importMnemonic",
        secretRecoveryPhrase: SECRET_RECOVERY_PHRASE,
        accountName: "Default",
        network: "Testnet",
        additionalAccounts: [
            {
                mode: "privateKey",
                privateKey: SECOND_PRIVATE_KEY,
                accountName: "Imported account",
            },
        ],
    });
});
