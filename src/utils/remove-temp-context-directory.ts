import fs from "node:fs/promises";

export async function removeTempContextDir(dir: string) {
    await fs.rm(dir, { maxRetries: 20, retryDelay: 200, recursive: true, force: true });
}
