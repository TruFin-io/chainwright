<h1 align="center">
<br>
<picture>
   <source media="(prefers-color-scheme: dark)" srcset="./.github/logo-dark.svg">
   <img src="./.github/logo-light.svg" alt="chainwright" width="500">
</picture>
<br><br>
<a href="https://npm.im/chainwright"><img src="https://badgen.net/npm/v/chainwright"></a> <a href="https://npm.im/chainwright"><img src="https://badgen.net/npm/dm/chainwright"></a>
</h1>

<h2 align="center" style="font-size: 24px; font-weight: bold;">
Test, automate, and verify every wallet interaction, with the precision your users expect.
</h2>

Chainwright is an end-to-end testing toolkit for Web3 dapps built on top of Playwright. It helps you prebuild browser extension wallet state, then reuse it in tests through ready-made fixtures.

## Features

- Wallet setup CLI to build reusable extension cache
- Playwright fixtures for wallet + Dapp testing
- Support for multiple wallet profiles per wallet
- Wallet action APIs for onboarding, account switching, transaction confirmation, and more
- Multiple wallet profile caching

## Supported Wallets

- MetaMask
- Solflare
- Petra
- Phantom
- Meteor
- Keplr

## Requirements

- Node.js `>=22`
- `@playwright/test@1.60.0` (peer dependency)

## Installation

```bash
pnpm add -D chainwright @playwright/test
```
```bash
bun add -D chainwright @playwright/test
```
```bash
npm install --save-dev chainwright @playwright/test
```
```bash
yarn add -D chainwright @playwright/test
```

After installation, make sure Playwright browsers are installed in your machine.

```bash
npx playwright install --chromium #Optional
```

```bash
bunx playwright install --chromium #Optional
```

## Quick Start

### 1. Create wallet setup files

Create a setup directory (default: `tests/wallet-setup`) and add `*.setup.ts` files with a wallet name in the filename, for example:

- `metamask.setup.ts`
- `petra.setup.ts`
- `phantom-team-a.setup.ts`

Each file should export `default defineWalletSetup(...)`.

```ts
// tests/wallet-setup/metamask.setup.ts
import { defineWalletSetup } from "chainwright/core";
import { Metamask } from "chainwright/metamask";

const PASSWORD = "test1234";
const SEED_PHRASE = "debris dress width prepare table repair index athlete divide avoid month member";

export default defineWalletSetup(
  PASSWORD,
  async ({ walletPage }) => {
    const metamask = new Metamask(walletPage);

    await metamask.onboard({
      mode: "import",
      secretRecoveryPhrase: SEED_PHRASE,
      mainAccountName: "Main",
    });
  },
  {
    profileName: "default", // optional
    slowMo: 200, // optional
  },
);
```

### 2. Build wallet cache

Run setup with the CLI:

```bash
chainwright ./tests/wallet-setup --wallets metamask
```

Useful flags:

- `-f, --force` overwrite existing cache
- `--wallets <wallets...>` select wallets (`metamask`, `solflare`, `petra`, `phantom`, `meteor`, `keplr`)
- `-a, --all` setup all wallets

Cache is stored under:

- `.wallet-cache/<wallet>/wallet-data` (default profile)
- `.wallet-cache/<wallet>/<profileName>` (custom profile)

### 3. Use wallet fixtures in Playwright tests

```ts
import { expect } from "@playwright/test";
import { testWithChainwright } from "chainwright/core";
import { metamaskFixture } from "chainwright/metamask";

const test = testWithChainwright(
  metamaskFixture({
    profileName: "default",
  }),
);

test("connect wallet to dapp", async ({ page, metamask }) => {
  await page.goto("https://your-dapp.example");
  await metamask.connectToApp("Account 1");
  await expect(page.getByText("Connected")).toBeVisible();
});
```

## Worker-Scoped Fixture

Use worker-scoped fixtures when you want one wallet context per worker and a prepared `dappPage`.

```ts
import { metamaskWorkerScopeFixture } from "chainwright/metamask";

export const test = metamaskWorkerScopeFixture({
  profileName: "default",
  dappUrl: "https://your-dapp.example",
});

test("confirm transaction", async ({ dappPage, metamask }) => {
  await dappPage.getByRole("button", { name: "Send Tx" }).click();
  await metamask.confirmTransaction();
});
```

`WorkerScopeFixtureArgs`:

- `profileName?: string`
- `slowMo?: number`
- `dappUrl?: string`

## Wallet Fixtures By Module

Each wallet module exports:

- `<wallet>Fixture(...)`
- `<wallet>WorkerScopeFixture(...)`
- `<WalletClass>`

Examples:

- `metamaskFixture`, `metamaskWorkerScopeFixture`, `Metamask`
- `phantomFixture`, `phantomWorkerScopeFixture`, `Phantom`
- `petraFixture`, `petraWorkerScopeFixture`, `Petra`
- `solflareFixture`, `solflareWorkerScopeFixture`, `Solflare`
- `meteorFixture`, `meteorWorkerScopeFixture`, `Meteor`
- `keplrFixture`, `keplrWorkerScopeFixture`, `Keplr`

Extra MetaMask fixtures:

- `createAnvilNode(options?)`
- `connectToAnvil()`

Extra Phantom/Solflare fixtures:

- `autoCloseNotification` (auto fixture)

## Core APIs

### `defineWalletSetup`

```ts
defineWalletSetup(password, setupFn, config?)
```

- `password: string` wallet unlock password saved in cache metadata
- `setupFn: ({ context, walletPage }) => Promise<void>` runs onboarding/import flow
- `config?: { profileName?: string; slowMo?: number }`

### `testWithChainwright`

```ts
testWithChainwright(customFixtures)
```

Merges Playwright `test` with your Chainwright fixture extension.

## Common Wallet Actions

Depending on wallet module, wallet class methods include:

- `onboard(...)`
- `unlock()`
- `lock()`
- `switchAccount(...)`
- `renameAccount(...)`
- `getAccountAddress(...)`
- `addAccount(...)`
- `connectToApp(...)`
- `confirmTransaction()`
- `rejectTransaction()`

Additional wallet-specific actions are available, for example:

- MetaMask: `switchNetwork`, `toggleShowTestnetNetwork`, `addCustomNetwork`
- Phantom: `switchNetwork`, `toggleOptionalChains`
- Petra/Solflare/Meteor: `switchNetwork`
- Meteor: `openSettings`

## Troubleshooting

- `Cache for <wallet> ... not found`: run `chainwright` setup first.
- Setup file not detected: ensure file matches `*.setup.ts` or `*.setup.js` and includes a wallet name.
- Existing profile conflict: use `--force` or a unique `profileName`.

## License

MIT
