import { defineWalletSetup } from "@/core/define-wallet-setup";
import { Phantom } from "@/wallets/phantom";

const PASSWORD = "test1234";
const PK_TWO = "0xdb8b55484c15a6caa975c300345afadda6d8dffac951175282fc8cf136a4d83a";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const phantom = new Phantom(walletPage);

    await phantom.onboard({
        mode: "recovery phrase",
        secretRecoveryPhrase: "leisure trust warrior unable skirt version oil debate burst shiver code stairs",
        toggleNetworkMode: {
            mode: "on",
            chain: "Solana",
            network: "Solana Devnet",
        },
        addWallet: [
            {
                accountName: "Delta",
                chain: "Ethereum",
                privateKey: PK_TWO,
            },
        ],
    });
});
