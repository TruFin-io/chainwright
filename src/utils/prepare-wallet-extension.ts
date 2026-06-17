import fs from "node:fs";
import path from "node:path";
import { styleText } from "node:util";
import AdmZip from "adm-zip";
import type { CLIOptions, ExtensionSource } from "@/types";
import { SUPPORTED_WALLETS } from "./constants";
import { downloadFile } from "./download-file";
import getCacheDirectory from "./get-cache-directory";
import { verifyFileIntegrity } from "./verify-file-integrity";

type Args = {
    force: boolean;
    name: CLIOptions;
    downloadUrl: string;
    extensionSource?: ExtensionSource;
};

let IS_EXECUTED = false;
let PREVIOUS_WALLET_NAME = "";

export async function prepareWalletExtension({ downloadUrl, name, force, extensionSource }: Args) {
    const CACHE_DIR_NAME = getCacheDirectory(name);
    const supportedWallet = SUPPORTED_WALLETS[name as Exclude<CLIOptions, "all">];
    const walletName = supportedWallet.extensionName;
    const zipFilePath = path.join(CACHE_DIR_NAME, `${name}-extension.zip`);
    const outputPath = path.join(CACHE_DIR_NAME, `${name}-extension`);

    const isExtensionSource = extensionSource && "downloadUrl" in extensionSource;
    const urlSource = isExtensionSource ? extensionSource.downloadUrl : downloadUrl;
    const localPath = extensionSource && "localPath" in extensionSource ? extensionSource.localPath : undefined;
    const expectedSha256 = isExtensionSource ? extensionSource.sha256 : supportedWallet.sha256;

    if (!IS_EXECUTED) {
        PREVIOUS_WALLET_NAME = walletName;
    } else {
        if (PREVIOUS_WALLET_NAME !== walletName && IS_EXECUTED) {
            IS_EXECUTED = false;
            PREVIOUS_WALLET_NAME = walletName;
        }
    }

    if (force && fs.existsSync(CACHE_DIR_NAME) && !IS_EXECUTED) {
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
        if (!localPath) {
            console.info(
                styleText("cyanBright", `📥 Downloading ${walletName} extension...`, { validateStream: false }),
            );
            await downloadFile({ url: urlSource, destination: zipFilePath });
            await verifyFileIntegrity({
                filePath: zipFilePath,
                expectedSha256,
                label: `${walletName} extension`,
            });
            console.info(
                styleText("green", `✅ ${name.toUpperCase()} Extension downloaded successfully.`, {
                    validateStream: false,
                }),
            );
        } else {
            console.info(
                styleText("cyanBright", `Using the local ${name} extension zip file`, {
                    validateStream: false,
                }),
            );
        }
    }

    // Unzip the archive if not already extracted
    if (!fs.existsSync(outputPath)) {
        console.info(`📦 Extracting extension...`);
        const zip = new AdmZip(!localPath ? zipFilePath : localPath);
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
