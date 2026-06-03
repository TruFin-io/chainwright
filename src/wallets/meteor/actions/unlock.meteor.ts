import type { Page } from "@playwright/test";
import { getWalletPasswordFromCache } from "@/utils/wallets/get-wallet-password-from-cache";

export async function unlock(page: Page) {
    const password = await getWalletPasswordFromCache("meteor");
    const passwordInput = page.locator("input[placeholder='Enter Password']");
    const unlockButton = page.locator('button:has-text("Unlock")');

    const isPasswordInputVisible = await passwordInput
        .waitFor({ state: "visible", timeout: 5_000 })
        .then(() => true)
        .catch(() => false);

    if (!isPasswordInputVisible) {
        console.info("💡 Wallet is already unlocked");
        return;
    }

    await passwordInput.fill(password);
    await unlockButton.click();
}
