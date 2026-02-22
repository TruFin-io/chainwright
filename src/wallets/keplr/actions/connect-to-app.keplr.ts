import type { Page } from "@playwright/test";
import { sleep } from "@/utils/sleep";

export async function connectToApp(page: Page) {
    const approveConnectionButton = page.getByRole("button", { name: "Approve", exact: true });
    approveConnectionButton.click();

    // Wait for the connection to be ready.
    await sleep(1_000);
}
