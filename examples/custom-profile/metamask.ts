import { defineWalletSetup } from "chainwright/core";
import { Metamask } from "chainwright/metamask";

const PASSWORD = "test1234";
const SECRET_RECOVERY_PHRASE = "Your secret phrase";

export default defineWalletSetup(
    PASSWORD,
    async ({ walletPage }) => {
        const metamask = new Metamask(walletPage);

        await metamask.onboard({
            mode: "import",
            secretRecoveryPhrase: SECRET_RECOVERY_PHRASE,
            mainAccountName: "Team profile",
        });
    },
    { profileName: "team-profile" },
);
