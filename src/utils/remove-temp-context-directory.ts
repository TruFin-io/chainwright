import fs from "node:fs/promises";

export async function removeTempContextDir(dir: string) {
    await fs.rm(dir, { maxRetries: 50, retryDelay: 500, recursive: true, force: true });
}
