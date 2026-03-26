import { test as base } from "@playwright/test";
import type { WorkerScopeFixtureArgs } from "@/types";
import { type WorkerScopeFixture, workerScopeContext } from "../utils/worker-scope-context";
import { {{WalletName}} } from "./{{walletName}}";
import { teardownContext } from "@/utils/teardown-context";
import { {{WalletName}}Profile } from "./{{walletName}}-profile";
import type { {{WalletName}}Fixture } from "./types";

export const {{walletName}}WorkerScopeFixture = ({ profileName, dappUrl, slowMo }: WorkerScopeFixtureArgs = {}) => {
    return base.extend<{{WalletName}}Fixture, WorkerScopeFixture<{{WalletName}}>>({
        workerScopeContents: [
            async ({ browser: _ }, use, workerInfo) => {
                const wallet = new {{WalletName}}Profile();
                const {
                    context,
                    contextPath,
                    walletPage: walletPageFromContext,
                } = await workerScopeContext({
                    wallet,
                    workerInfo,
                    profileName,
                    slowMo,
                });
                await context.grantPermissions(["clipboard-read"]);

                for (const page of context.pages()) {
                    if (page.url().includes(wallet.onboardingPath)) {
                        await page.close();
                    }
                }

                const {{walletName}} = new {{WalletName}}(walletPageFromContext);
                await {{walletName}}.unlock();


                await use({ wallet: {{walletName}}, walletPage: walletPageFromContext, context });
                await teardownContext(context, contextPath);
            },
            { scope: "worker" },
        ],
        dappPage: [
            async ({ workerScopeContents }, use) => {
                const { context } = workerScopeContents;
                const dappPage = await context.newPage();
                if (dappUrl) {
                    await dappPage.goto(dappUrl);
                }
                await use(dappPage);
            },
            { scope: "worker" },
        ],
        {{walletName}}Page: async ({ workerScopeContents }, use) => {
            await use(workerScopeContents.walletPage);
        },
        {{walletName}}: async ({ workerScopeContents }, use) => {
            const {{walletName}}Instance = new {{WalletName}}(workerScopeContents.walletPage);
            await use({{walletName}}Instance);
        },
    });
};
