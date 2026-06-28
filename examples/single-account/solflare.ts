import { defineWalletSetup } from "chainwright/core";
import { Solflare } from "chainwright/solflare";

const PASSWORD = "test1234";
const RECOVERY_PHRASE = "Your secret phrase";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const solflare = new Solflare(walletPage);

    await solflare.onboard({
        recoveryPhrase: RECOVERY_PHRASE,
        walletName: "Default",
        network: "Devnet",
    });
});
