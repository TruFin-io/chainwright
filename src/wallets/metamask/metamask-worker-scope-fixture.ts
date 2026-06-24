import { test as base } from "@playwright/test";
import { Instance, Pool } from "prool";
import type { WalletProfileFixtureArgs } from "@/types";
import { teardownContext } from "@/utils/teardown-context";
import type { WorkerScopeFixture } from "../utils/worker-scope-context";
import { Metamask } from "./metamask";
import type { AnvilNodeOptions, CreateAnvilNodeResult, MetamaskFixture } from "./types";
import { workerScopeContextMetamask } from "./worker-scope-context.metamask";

export const metamaskWorkerScopeFixture = ({ profileName, slowMo }: WalletProfileFixtureArgs = {}) => {
    return base.extend<MetamaskFixture, WorkerScopeFixture<Metamask>>({
        workerScopeContents: [
            async ({ browser: _ }, use, workerInfo) => {
                const {
                    context,
                    contextPath,
                    walletPage: walletPageFromContext,
                } = await workerScopeContextMetamask({
                    workerInfo,
                    profileName,
                    slowMo,
                });
                const metamask = new Metamask(walletPageFromContext);
                await metamask.unlock();

                await use({ wallet: metamask, walletPage: walletPageFromContext, context });
                await teardownContext(context, contextPath);
            },
            { scope: "worker" },
        ],
        createAnvilNode: async ({ context: _ }, use, testInfo) => {
            const poolId = testInfo.workerIndex;
            let pool: Pool.define.ReturnType<number> | undefined;

            await use(async (options?: AnvilNodeOptions): Promise<CreateAnvilNodeResult> => {
                pool = Pool.define({
                    instance: Instance.anvil(options),
                });
                const anvil = await pool.start(poolId);
                const rpcUrl = `http://${anvil.host}:${anvil.port}`;

                const DEFAULT_ANVIL_CHAIN_ID = 31337;
                const chainId = options?.chainId ?? DEFAULT_ANVIL_CHAIN_ID;

                return { rpcUrl, anvil, chainId };
            });

            if (pool) {
                await pool.stop(poolId);
            }
        },
        connectToAnvil: async ({ context: _, createAnvilNode, workerScopeContents }, use) => {
            await use(async () => {
                const { wallet } = workerScopeContents;
                const { chainId, rpcUrl } = await createAnvilNode({ chainId: 2251 });
                await wallet.addCustomNetwork({
                    chainId,
                    currencySymbol: "ETH",
                    networkName: "Anvil Localnet",
                    rpcUrl: rpcUrl,
                });
            });
        },
    });
};
