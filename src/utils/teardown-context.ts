import type { BrowserContext } from "@playwright/test";
import { removeTempContextDir } from "./remove-temp-context-directory";

const CONTEXT_CLOSE_TIMEOUT_MS = 35_000;

export async function teardownContext(context: BrowserContext, contextPath: string): Promise<void> {
    try {
        await Promise.race([
            context.close(),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Context close timed out")), CONTEXT_CLOSE_TIMEOUT_MS),
            ),
        ]);
    } catch (error) {
        console.warn(`Browser context close did not complete cleanly: ${(error as Error).message}`);
    }

    try {
        await removeTempContextDir(contextPath);
    } catch (error) {
        console.error(`Failed to remove temporary context directory at ${contextPath}. Error:`, error);
    }
}
