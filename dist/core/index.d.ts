import { b as WalletSetupFunction, a as WalletSetupConfig } from '../types-aoLElQ63.js';
import { Fixtures, TestType } from '@playwright/test';

declare function defineWalletSetup(password: string, fn: WalletSetupFunction, config?: WalletSetupConfig): Promise<{
    fn: WalletSetupFunction;
    password: string;
    config: WalletSetupConfig;
}>;

/**
 * Builds a Playwright `test` with Chainwright fixtures.
 *
 * Chainwright extends Playwright for Web3 testing, especially wallet flows.
 *
 * @param customFixtures - Extra fixtures to merge into the base test.
 * @returns A composed `test` with Playwright + Chainwright.
 *
 * @example
 * ```ts
 * const test = testWithChainwright(myCustomFixtures);
 * test('Web3 test', async ({ page, chainwright }) => {});
 * ```
 */
declare function testWithChainwright<TestFixtures extends Fixtures, WorkerFixtures extends Fixtures>(customFixtures: TestType<TestFixtures, WorkerFixtures>): TestType<TestFixtures, WorkerFixtures>;

export { WalletSetupConfig, WalletSetupFunction, defineWalletSetup, testWithChainwright };
