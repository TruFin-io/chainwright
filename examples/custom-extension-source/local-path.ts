import { defineWalletSetup } from "chainwright/core";

const PASSWORD = "test1234";
//const LOCAL_EXTENSION_ZIP = path.resolve(process.cwd(), "your path")
const LOCAL_EXTENSION_ZIP = "/absolute/path/to/metamask-extension.zip";

export default defineWalletSetup(
    PASSWORD,
    async () => {
        //... Onboarding logic here
    },
    {
        extensionSource: {
            localPath: LOCAL_EXTENSION_ZIP,
        },
    },
);
