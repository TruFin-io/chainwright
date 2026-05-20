import { test as base } from "@playwright/test";
import type { WalletProfileFixtureArgs } from "@/types";
import { teardownContext } from "@/utils/teardown-context";
import { type WorkerScopeFixture, workerScopeContext } from "../utils/worker-scope-context";
import { Petra } from "./petra";
import { PetraProfile } from "./petra-profile";
import type { PetraFixture } from "./types";

export const petraWorkerScopeFixture = ({ slowMo, profileName }: WalletProfileFixtureArgs = {}) => {
    return base.extend<PetraFixture, WorkerScopeFixture<Petra>>({
        workerScopeContents: [
            async ({ browser: _ }, use, workerInfo) => {
                const wallet = new PetraProfile();
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

                const petra = new Petra(walletPageFromContext);
                await petra.unlock();
                await use({ wallet: petra, walletPage: walletPageFromContext, context });
                await teardownContext(context, contextPath);
            },
            { scope: "worker" },
        ],
    });
};
