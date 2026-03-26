import type { BrowserContext } from "@playwright/test";
import { getPopupPageFromContext } from "@/utils/wallets/get-popup-page-from-context";
import { getWalletExtensionIdFromCache } from "@/utils/wallets/get-wallet-extension-id-from-cache";

export class {{WalletName}}Profile {
    readonly name = "{{walletName}}" as const;
    readonly onboardingPath = "" // Not implemented;

    async indexUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/<home/index path>.html`;
    }

    async promptUrl() {
        const extensionId = await this.extensionId();
        return `chrome-extension://${extensionId}/<Notification/prompt path>.html`;
    }

    async extensionId() {
        return await getWalletExtensionIdFromCache(this.name);
    }

    async promptPage(context: BrowserContext) {
        const popupUrl = await this.promptUrl();
        const popupPage = await getPopupPageFromContext({
            context,
            path: popupUrl,
            locator: "Enter locator here", // Target the locator of the extension popup page that let's you know the popup page is ready for interaction.
        });
        return popupPage;
    }
}
