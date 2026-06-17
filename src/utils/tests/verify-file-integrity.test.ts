import fs from "node:fs";
import path from "node:path";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { calculateFileSha256, verifyFileIntegrity } from "../verify-file-integrity";

describe("verifyFileIntegrity", () => {
    const TEST_DIR = path.resolve(process.cwd(), "src/utils/.test-integrity");

    beforeAll(() => {
        if (!fs.existsSync(TEST_DIR)) {
            fs.mkdirSync(TEST_DIR, { recursive: true });
        }
    });

    afterEach(() => {
        if (fs.existsSync(TEST_DIR)) {
            const files = fs.readdirSync(TEST_DIR);
            for (const file of files) {
                fs.unlinkSync(path.resolve(TEST_DIR, file));
            }
        }
    });

    afterAll(() => {
        if (fs.existsSync(TEST_DIR)) {
            fs.rmSync(TEST_DIR, { recursive: true, force: true });
        }
    });

    it("should calculate the SHA-256 checksum for a file", async () => {
        const filePath = path.resolve(TEST_DIR, "wallet-extension.zip");
        fs.writeFileSync(filePath, "chainwright");

        await expect(calculateFileSha256(filePath)).resolves.toBe(
            "bc76cca2cc8ec743bd5b2622c5237b8ebc00dcfe40132661141bfb84510f5470",
        );
    });

    it("should return the calculated checksum when the file matches the expected SHA-256", async () => {
        const filePath = path.resolve(TEST_DIR, "verified-extension.zip");
        const expectedSha256 = "b24f022f72d71a6e5c89e7ccac48e5c87514ece5f9057dc68aba4f26d8a94867";
        fs.writeFileSync(filePath, "verified wallet extension zip bytes");

        await expect(
            verifyFileIntegrity({
                filePath,
                expectedSha256,
                label: "Phantom extension",
            }),
        ).resolves.toBe(expectedSha256);
    });

    it("should accept uppercase SHA-256 checksums", async () => {
        const filePath = path.resolve(TEST_DIR, "uppercase-checksum.zip");
        const expectedSha256 = "bc76cca2cc8ec743bd5b2622c5237b8ebc00dcfe40132661141bfb84510f5470";
        fs.writeFileSync(filePath, "chainwright");

        await expect(
            verifyFileIntegrity({
                filePath,
                expectedSha256: expectedSha256.toUpperCase(),
                label: "MetaMask extension",
            }),
        ).resolves.toBe(expectedSha256);
    });

    it("should reject invalid SHA-256 checksum values before reading the file", async () => {
        const filePath = path.resolve(TEST_DIR, "invalid-checksum.zip");
        fs.writeFileSync(filePath, "chainwright");

        await expect(
            verifyFileIntegrity({
                filePath,
                expectedSha256: "not-a-valid-sha256",
                label: "Solflare Wallet extension",
            }),
        ).rejects.toThrow("Solflare Wallet extension has an invalid SHA-256 checksum.");
    });

    it("should reject when the file checksum does not match the expected SHA-256", async () => {
        const filePath = path.resolve(TEST_DIR, "tampered-extension.zip");
        const expectedSha256 = "b24f022f72d71a6e5c89e7ccac48e5c87514ece5f9057dc68aba4f26d8a94867";
        const actualSha256 = "187d0fd4ad8f820666dac423dd6da37a762b51abe26ba319b0491b8680bc9ddd";
        fs.writeFileSync(filePath, "tampered wallet extension zip bytes");

        await expect(
            verifyFileIntegrity({
                filePath,
                expectedSha256,
                label: "Keplr extension",
            }),
        ).rejects.toThrow(
            [
                "Keplr extension failed integrity verification.",
                `Expected SHA-256: ${expectedSha256}`,
                `Actual SHA-256:   ${actualSha256}`,
                "The file was not extracted.",
            ].join("\n"),
        );
    });

    it("should reject when the file cannot be read", async () => {
        const missingFilePath = path.resolve(TEST_DIR, "missing-extension.zip");

        await expect(calculateFileSha256(missingFilePath)).rejects.toMatchObject({
            code: "ENOENT",
        });
    });
});
