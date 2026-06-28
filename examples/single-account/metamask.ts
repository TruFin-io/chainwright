import { defineWalletSetup } from "chainwright/core";
import { Metamask } from "chainwright/metamask";

/**
 * Setting up MetaMask.
 *
 * MetaMask uses an Hierarchical Deterministic (HD) wallet model: the seed phrase
 * is the root secret, and accounts are deterministically derived from it using
 * derivative paths like m/44'/60'/0'/0/n.
 *
 * So, when you import an account using the seed phrase, MetaMask can recreate the
 * same sequence of addresses by deriving the already existing accounts in the wallet.
 * This is why we don't need an "additionalAccounts" argument in the onboarding action
 * for the MetaMask wallet.
 */

const PASSWORD = "test1234";

export default defineWalletSetup(PASSWORD, async ({ walletPage }) => {
    const metamask = new Metamask(walletPage);
    const seedPhrase = "Your secret phrase";

    await metamask.onboard({
        mode: "import",
        secretRecoveryPhrase: seedPhrase,
        mainAccountName: "Test",
    });
});
