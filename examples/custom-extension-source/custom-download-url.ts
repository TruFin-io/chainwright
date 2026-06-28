import { defineWalletSetup } from "chainwright/core";

const PASSWORD = "test1234";
const EXTENSION_DOWNLOAD_URL = "https://example.com/metamask-extension.zip";
const EXTENSION_SHA256 = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

export default defineWalletSetup(
    PASSWORD,
    async () => {
        //.. Onboarding logi. here
    },
    {
        extensionSource: {
            downloadUrl: EXTENSION_DOWNLOAD_URL,
            sha256: EXTENSION_SHA256,
        },
    },
);
