import path from "node:path";
import { describe, expect, it } from "vitest";
import createTempContextDirectory from "../create-temp-context-directory";

describe("createTempContextDirectory", () => {
    it("resolves temporary context directories from the current project directory", async () => {
        await expect(createTempContextDirectory("chromium-test-id")).resolves.toBe(
            path.resolve(process.cwd(), ".wallet-context", "chromium-test-id"),
        );
    });
});
