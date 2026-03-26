import fs from "node:fs";
import path from "node:path";
import { styleText } from "node:util";
import AdmZip from "adm-zip";
import type { CLIOptions } from "@/types";
import { SUPPORTED_WALLETS } from "./constants";
import { downloadFile } from "./download-file";
import getCacheDirectory from "./get-cache-directory";

type Args = {
    force: boolean;
    name: CLIOptions;
    downloadUrl: string;
};

let IS_EXECUTED = false;

export async function prepareWalletExtension({ downloadUrl, name, force }: Args) {
    const CACHE_DIR_NAME = getCacheDirectory(name);
    const supportedWallet = SUPPORTED_WALLETS[name as Exclude<CLIOptions, "all">];
    const walletName = supportedWallet.extensionName;
    const zipFilePath = path.join(CACHE_DIR_NAME, `${name}-extension.zip`);
    const outputPath = path.join(CACHE_DIR_NAME, `${name}-extension`);

    if (force && fs.existsSync(CACHE_DIR_NAME)) {
        fs.rmSync(CACHE_DIR_NAME, { recursive: true });
        console.info(
            styleText("magenta", `🧹 Removed ${walletName} because of the force flag`, { validateStream: false }),
        );
    }

    // Ensure the cache directory exists
    if (!fs.existsSync(CACHE_DIR_NAME)) {
        fs.mkdir(CACHE_DIR_NAME, { recursive: true }, (error) => {
            if (error) throw Error("Failed to create cache directory");
            console.info(`✅ ${walletName} Cache directory created successfully.`);
        });
    }

    // Download wallet extension if not cached
    if (fs.existsSync(outputPath)) {
        console.info(`✅ ${walletName} Version is downloaded already.`);
    } else {
        console.info(styleText("cyanBright", `📥 Downloading ${walletName} extension...`, { validateStream: false }));
        await downloadFile({ url: downloadUrl, destination: zipFilePath });
        console.info(
            styleText("green", `✅ ${name.toUpperCase()} Extension downloaded successfully.`, {
                validateStream: false,
            }),
        );
    }

    // Unzip the archive if not already extracted
    if (!fs.existsSync(outputPath)) {
        console.info(`📦 Extracting extension...`);
        const zip = new AdmZip(zipFilePath);
        zip.extractAllTo(outputPath, true);
        console.info(`✅ ${walletName} Extension extracted successfully.`);
    } else {
        if (IS_EXECUTED) {
            console.info(
                styleText("magentaBright", `Using the cached ${walletName} extension for profile creation.`, {
                    validateStream: false,
                }),
            );
            return outputPath;
        }

        console.info(
            styleText(
                "yellow",
                `⚠️ Skipping ${walletName} cache creation: Cache already exists at ${outputPath}. Use --force to overwrite.`,
                { validateStream: false },
            ),
        );
    }

    // Validate the extracted extension
    const manifestPath = path.join(outputPath, "manifest.json");
    if (!fs.existsSync(manifestPath)) {
        throw new Error(`❌ (${walletName}) Invalid extension: manifest.json not found`);
    }

    IS_EXECUTED = true;

    return outputPath;
}
