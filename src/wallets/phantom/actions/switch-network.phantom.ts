import type { Page } from "@playwright/test";
import { settingsSelectors } from "../selectors/homepage-selectors.phantom";
import type { SwitchNetwork } from "../types";
import { openSettings } from "./open-settings.phantom";

type SwitchNetworkParams = SwitchNetwork & { page: Page };

export async function switchNetwork({ page, ...args }: SwitchNetworkParams) {
    await openSettings(page);

    const developerSettingsButton = page.locator(`button[id='${settingsSelectors.developerSettingsButton}']`);
    await developerSettingsButton.scrollIntoViewIfNeeded();
    await developerSettingsButton.click();

    const toggleTestnetButton = page.getByTestId("toggleTestNetwork");
    const toggleTestnetSwitch = toggleTestnetButton.locator(
        "label[data-testid='toggleTestNetwork-switch'] > input[aria-label='Toggle']",
    );

    const isSwitchChecked = await toggleTestnetSwitch.isChecked().catch(() => false);
    if (!isSwitchChecked && args.mode === "on") {
        await toggleTestnetButton.click();
    }

    if (isSwitchChecked && args.mode === "off") {
        await toggleTestnetButton.click();
        const headerBackButton = page.getByTestId("header--back");
        await headerBackButton.click();

        const settingsCloseButton = page.getByTestId(settingsSelectors.closeMenuButton);
        await settingsCloseButton.click();
        return;
    }

    if (args.mode === "on" && args.chain === "Solana") {
        const { network } = args;
        const networkButton = page.locator(`button:has-text("${network}")`);
        await networkButton.click();
    }

    if (args.mode === "on" && args.chain === "Ethereum") {
        const { network } = args;
        const evmHeader = page.getByText("EVM", { exact: true });
        const isEvmHeaderVisible = await evmHeader.isVisible().catch(() => false);

        if (!isEvmHeaderVisible) {
            throw new Error(
                [
                    "EVM testnet options are not available. Please ensure Ethereum is enabled in optional chains.",
                    "To enable Ethereum, call the 'toggleOptionalChain' action before switching the network.",
                    "toggleOptionalChain({ page: page, toggleMode: 'on', supportedChains: ['Ethereum'] })",
                    "Tip: For persistence, enable Ethereum in your setup file after the onboarding step completes.",
                ].join("\n"),
            );
        }

        const networkButton = page.locator(`button:has-text("${network}")`);
        await networkButton.click();
    }

    const headerBackButton = page.getByTestId("header--back");
    await headerBackButton.click();

    const settingsCloseButton = page.getByTestId(settingsSelectors.closeMenuButton);
    await settingsCloseButton.click();
}
