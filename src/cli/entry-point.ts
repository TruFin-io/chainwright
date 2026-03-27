import path from "node:path";
import { fileURLToPath } from "node:url";
import { styleText } from "node:util";
import { checkbox } from "@inquirer/prompts";
import { Command } from "commander";
import { generateTypes } from "@/core/generate-types";
import getSetupFunction from "@/core/get-setup-function";
import { triggerCacheCreation } from "@/core/trigger-cache-creation";
import type { CLIOptions, SupportedWallets } from "@/types";
import { WALLET_SETUP_DIR_NAME } from "../utils/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.join(__dirname, "..", "tests", WALLET_SETUP_DIR_NAME);
const MAX_RETRIES = 2;

type ActionOptions = {
    headless: boolean;
    force: boolean;
    all: "all" | boolean;
    metamask: "metamask" | boolean;
    solflare: "solflare" | boolean;
    petra: "petra" | boolean;
    meteor: "meteor" | boolean;
    keplr: "keplr" | boolean;
    phantom: "phantom" | boolean;
    wallets?: CLIOptions[]; // Add this line to include the wallets option
};

export async function clientEntry() {
    const program = new Command();

    program
        .name(styleText("yellow", "Chainwright"))
        .description(styleText("green", "A CLI tool for setting up wallet cache for E2E testing of web3 applications"))
        .version(styleText("blue", "0.0.0"));

    program
        .command("chainwright")
        .argument("[dir]", "Directory containing the wallet setup functions", path.resolve(BASE_DIR))
        .option(
            "--headless",
            "Build cache in the headless browser mode. Alternatively, set the `HEADLESS` env variable to `true`",
            false,
        )
        .option("-f, --force", "Force the creation of cache even if it already exists", false)
        .option("-a, --all", "Setup all wallets", "all")
        .option("--kp, --keplr", "Setup Keplr", "keplr")
        .option("-m, --metamask", "Setup MetaMask", "metamask")
        .option("--mt, --meteor", "Setup Meteor", "meteor")
        .option("--pt, --petra", "Setup Petra", "petra")
        .option("--ph, --phantom", "Setup Phantom", "phantom")
        .option("-s, --solflare", "Setup Solflare", "solflare")
        .option("--wls, --wallets <wallets...>", "Specify wallets to setup (e.g., --wallets keplr metamask)")
        .action(async (setupDir: string, flags: ActionOptions) => {
            // Use this to filter out "headless" and "force"
            const commandOptions: Array<CLIOptions> = [
                "all",
                "metamask",
                "solflare",
                "petra",
                "meteor",
                "keplr",
                "phantom",
            ];

            const flagValue = Object.keys(flags).filter((_key) => {
                return commandOptions.includes(_key as CLIOptions)
                    ? flags[_key as keyof ActionOptions] === true
                    : false;
            });

            const isWalletSelected = flagValue.length > 0;
            const multipleWallets = flags.wallets;

            const response = multipleWallets
                ? multipleWallets
                : !isWalletSelected
                  ? await checkbox<CLIOptions>({
                        message: "Select the wallet you want to setup",
                        choices: [
                            { name: "All", value: "all" },
                            { name: "Keplr", value: "keplr" },
                            { name: "MetaMask", value: "metamask" },
                            { name: "Meteor", value: "meteor" },
                            { name: "Petra", value: "petra" },
                            { name: "Phantom", value: "phantom" },
                            { name: "Solflare", value: "solflare" },
                        ],
                        pageSize: 10,
                    })
                  : flagValue;

            let walletSetupDir = setupDir;
            const customDirectory = program.commands[0]?.args ?? [];

            if (customDirectory[0]) walletSetupDir = path.resolve(process.cwd(), customDirectory[0]);

            if (flags.headless) process.env.HEADLESS = true;

            const _setupFunction = await getSetupFunction({
                walletSetupDir,
                selectedWallet: response as Array<CLIOptions>,
            });

            for (const { walletName, config, walletPassword, setupFunction, fileList } of _setupFunction) {
                try {
                    console.info(
                        styleText("cyanBright", `\n Setting up cache for ${walletName}...`, { validateStream: false }),
                    );

                    await triggerCacheCreation({
                        walletName: walletName as SupportedWallets,
                        config,
                        setupFunction,
                        fileList,
                        force: flags.force,
                        walletPassword: walletPassword,
                    });

                    // Dynamically generate the profile name types
                    if (config.profileName) {
                        await generateTypes({ walletName, profileName: config.profileName });
                    }
                } catch (error) {
                    if ((error as Error).message.includes("directory already exists")) {
                        console.warn((error as Error).message);
                    }

                    if (!(error as Error).message.includes("directory already exists")) {
                        console.error(
                            styleText(
                                "redBright",
                                `\n ❌ Failed to setup cache for ${walletName}: ${(error as Error).message}`,
                                { validateStream: false },
                            ),
                        );

                        // If the setup fails
                        let retryCount = 0;
                        while (MAX_RETRIES > retryCount) {
                            console.info(
                                `${styleText("yellow", `Retry Attempt ${retryCount + 1} of ${MAX_RETRIES} for ${walletName}...`, { validateStream: false })}`,
                            );
                            console.info(styleText("yellow", `Retrying wallet setup...`, { validateStream: false }));
                            try {
                                await triggerCacheCreation({
                                    walletName: walletName as SupportedWallets,
                                    config,
                                    setupFunction,
                                    fileList,
                                    force: flags.force,
                                    walletPassword: walletPassword,
                                });
                                break; // Break the loop if setup is successful
                            } catch (error) {
                                if (retryCount + 1 < MAX_RETRIES) {
                                    console.error(
                                        styleText("redBright", `\n ❌ Attempt ${retryCount + 1} failed! Retrying...`, {
                                            validateStream: false,
                                        }),
                                    );
                                }

                                retryCount++;
                                if (retryCount === MAX_RETRIES) {
                                    console.error(
                                        styleText(
                                            "redBright",
                                            `❌ Failed to setup cache after ${MAX_RETRIES} attempts for ${walletName}: ${(error as Error).message}`,
                                            { validateStream: false },
                                        ),
                                    );
                                }
                            }
                        }
                    }
                }
            }
        });

    await program.parseAsync(process.argv);
}

clientEntry().catch((error) =>
    console.error(
        styleText("redBright", `Failed to run the CLI: ${(error as Error).message})`, { validateStream: false }),
    ),
);
