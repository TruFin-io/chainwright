import { test as base } from "@playwright/test";
import type { WalletProfileFixtureArgs } from "@/types";
import { teardownContext } from "@/utils/teardown-context";
import { type WorkerScopeFixture, workerScopeContext } from "../utils/worker-scope-context";
import { Keplr } from "./keplr";
import { KeplrProfile } from "./keplr-profile";
import type { KeplrFixture } from "./types";

export const keplrWorkerScopeFixture = ({ slowMo, profileName }: WalletProfileFixtureArgs = {}) => {
    return base.extend<KeplrFixture, WorkerScopeFixture<Keplr>>({
        workerScopeContents: [
            async ({ browser: _ }, use, workerInfo) => {
                const wallet = new KeplrProfile();
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
                    if (page.url().includes("about:blank")) {
                        await page.close();
                    }
                }

                const keplr = new Keplr(walletPageFromContext);
                await keplr.unlock();

                await use({ wallet: keplr, walletPage: walletPageFromContext, context });
                await teardownContext(context, contextPath);
            },
            { scope: "worker" },
        ],
    });
};
