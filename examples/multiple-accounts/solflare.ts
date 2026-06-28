import { defineWalletSetup } from "chainwright/core";
import { Solflare } from "chainwright/solflare";

const PASSWORD = "test1234";
const RECOVERY_PHRASE = "Your secret phrase";
const SECOND_PRIVATE_KEY = "Your private key";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const solflare = new Solflare(walletPage);

    await solflare.onboard({
        recoveryPhrase: RECOVERY_PHRASE,
        walletName: "Default",
        network: "Devnet",
        additionalAccounts: [
            {
                walletName: "Imported account",
                privateKey: SECOND_PRIVATE_KEY,
            },
        ],
    });
});
