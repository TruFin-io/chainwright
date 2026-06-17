import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";

type VerifyFileIntegrityArgs = {
    filePath: string;
    expectedSha256: string;
    label: string;
};

const SHA256_REGEX = /^[a-f0-9]{64}$/i;

export async function calculateFileSha256(filePath: string) {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);

    return await new Promise<string>((resolve, reject) => {
        stream.on("data", (chunk) => hash.update(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(hash.digest("hex")));
    });
}

export async function verifyFileIntegrity({ filePath, expectedSha256, label }: VerifyFileIntegrityArgs) {
    if (!SHA256_REGEX.test(expectedSha256)) {
        throw new Error(`${label} has an invalid SHA-256 checksum.`);
    }

    const actualSha256 = await calculateFileSha256(filePath);

    if (actualSha256.toLowerCase() !== expectedSha256.toLowerCase()) {
        throw new Error(
            [
                `${label} failed integrity verification.`,
                `Expected SHA-256: ${expectedSha256}`,
                `Actual SHA-256:   ${actualSha256}`,
                `The file was not extracted.`,
            ].join("\n"),
        );
    }

    return actualSha256;
}
