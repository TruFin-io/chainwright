import { test as base } from "@playwright/test";
import type { WalletProfileFixtureArgs } from "@/types";
import { teardownContext } from "@/utils/teardown-context";
import { type WorkerScopeFixture, workerScopeContext } from "../utils/worker-scope-context";
import { Meteor } from "./meteor";
import { MeteorProfile } from "./meteor-profile";
import type { MeteorFixture } from "./types";

export const meteorWorkerScopeFixture = ({ slowMo, profileName }: WalletProfileFixtureArgs = {}) => {
    return base.extend<MeteorFixture, WorkerScopeFixture<Meteor>>({
        workerScopeContents: [
            async ({ browser: _ }, use, workerInfo) => {
                const {
                    context,
                    contextPath,
                    walletPage: walletPageFromContext,
                } = await workerScopeContext({
                    workerInfo,
                    profileName,
                    slowMo,
                    wallet: new MeteorProfile(),
                });

                await context.grantPermissions(["clipboard-read"]);
                for (const page of context.pages()) {
                    if (page.url().includes("about:blank")) {
                        await page.close();
                    }
                }

                const meteor = new Meteor(walletPageFromContext);
                await meteor.unlock();
                await use({ wallet: meteor, walletPage: walletPageFromContext, context });
                await teardownContext(context, contextPath);
            },
            { scope: "worker" },
        ],
    });
};
