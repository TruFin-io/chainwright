import { defineWalletSetup } from "chainwright/core";
import { Petra } from "chainwright/petra";

const PASSWORD = "TestPetra45!!";
const SECRET_RECOVERY_PHRASE = "Your secret phrase";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const petra = new Petra(walletPage);

    await petra.onboard({
        mode: "importMnemonic",
        secretRecoveryPhrase: SECRET_RECOVERY_PHRASE,
        accountName: "Default",
        network: "Testnet",
    });
});
