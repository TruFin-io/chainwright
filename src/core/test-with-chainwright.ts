import type { Fixtures, TestType } from "@playwright/test";
import { test as base, mergeTests } from "@playwright/test";

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

export function testWithChainwright<CustomFixtures extends Fixtures>(
    customFixtures: TestType<CustomFixtures, object>,
): TestType<CustomFixtures, object> {
    return mergeTests(base, customFixtures);
}
