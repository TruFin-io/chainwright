import path from "node:path";
import { describe, expect, it } from "vitest";
import getCacheDirectory from "../get-cache-directory";

describe("getCacheDirectory", () => {
    it("resolves wallet cache directories from the current project directory", () => {
        expect(getCacheDirectory("metamask")).toBe(path.resolve(process.cwd(), ".wallet-cache", "metamask"));
    });
});
