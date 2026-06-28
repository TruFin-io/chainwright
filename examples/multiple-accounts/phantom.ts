import { defineWalletSetup } from "chainwright/core";
import { Phantom } from "chainwright/phantom";

const PASSWORD = "test1234";
const SECRET_RECOVERY_PHRASE = "Your secret phrase";
const ETHEREUM_PRIVATE_KEY = "Your private key";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const phantom = new Phantom(walletPage);

    await phantom.onboard({
        mode: "recovery phrase",
        secretRecoveryPhrase: SECRET_RECOVERY_PHRASE,
        accountName: "Default",
        toggleNetworkMode: {
            mode: "on",
            chain: "Solana",
            network: "Solana Devnet",
        },
        additionalAccounts: [
            {
                accountName: "Ethereum account",
                chain: "Ethereum",
                privateKey: ETHEREUM_PRIVATE_KEY,
            },
        ],
    });
});
