<h1 align="center">
<br>
<picture>
   <source media="(prefers-color-scheme: dark)" srcset="./.github/logo-dark.svg">
   <img src="./.github/logo-light.svg" alt="chainwright" width="500">
</picture>
<br><br>
<span align="center">
Test, automate, and verify every wallet interaction, with the precision your users expect.
</span>
<br><br>
<span align="center">
<a href="https://npm.im/chainwright"><img src="https://badgen.net/npm/v/chainwright"></a> <a href="https://npm.im/chainwright"><img src="https://badgen.net/npm/dm/chainwright"></a>
</span>
</h1>



Chainwright is an end-to-end testing toolkit for Web3 dapps built on top of Playwright. It helps you prebuild browser extension wallet state, then reuse it in your end-to-end tests through ready-made fixtures.

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

Each file must export `default defineWalletSetup(...)`.

```ts
// tests/wallet-setup/metamask.setup.ts
import { defineWalletSetup } from "chainwright/core";
import { Metamask } from "chainwright/metamask";

const PASSWORD = "test1234"; // For Petra wallet, you have to use a strong password. e.g. PlayerPetra45!!
const SEED_PHRASE = "test test test test test test test test test test test test test";

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
    ...//Optional prarmeters here
  },
);
```

**For Wallets with additional accounts**

```ts
// tests/wallet-setup/metamask.setup.ts
import { defineWalletSetup } from "chainwright/core";
import { Petra } from "chainwright/petra";

const PASSWORD = "PlayerPetra45!!";

export default defineWalletSetup(
  PASSWORD,
  async ({ walletPage }) => {
    const petra = new Petra(walletPage);

    await petra.onboard({
      mode: "importMnemonic",
      accountName: "default",
      secretRecoveryPhrase: "test test test...", // Seed phrase for the main account
      additionalAccounts: [
        {
          accountName: "nw-account",
          mode: "mnemonic",
          mnemonicPhrase: "test test test..." // Seed Phrase for this account
        },
      ]
    });
  },
  {
    ...//Optional prarmeters here
  }
);
```

### 2. Build wallet cache

Run setup with the CLI (Supports npx, bun, pnpm, and yarn):

> NB: By default, Chainwright looks for `tests/wallet-setup` in your base directory. However, you can specify the directory you want Chainwright to get your setup files from.

```bash
bun chainwright --wallets metamask
```

To specify a directory:

```bash
bun chainwright <directory path> <wallet> -f #Optional flag
```

Useful flags:

- `-f, --force` overwrite existing cache
- `--wallets <wallets...>` select wallets (`metamask`, `solflare`, `petra`, `phantom`, `meteor`, `keplr`). Setup multiple wallets at  the same time.
- `-a, --all` setup all wallets
- `--kp, --keplr` setup keplr wallet
- `-m, --metamask` setup metamask wallet
- `--mt, --meteor` setup the meteor wallet
- `--pt, --petra` setup petra wallet
- `--ph, --phantom` setup phantom wallet
- `-s, --solflare` setup solflare wallet

Cache is stored under:

- `.wallet-cache/<wallet>/wallet-data` (default profile)
- `.wallet-cache/<wallet>/<profileName>` (custom profile)

### 3. Use wallet fixtures in Playwright tests

```ts
import { expect } from "@playwright/test";
import { testWithChainwright } from "chainwright/core";
import { metamaskFixture } from "chainwright/metamask";

// Fixture
export const testWithMetamask = testWithChainwright(metamaskFixture());

// Extend Chainwright's metamaskFixture to suit your need
export const testDappFixture = testWithMetamask.extend<TestDappFixture>({
    context: async({ context: _ }, use) => {
    //...Context content here
    },
    dappPage: async ({ page, baseURL }, use) => {
        await page.goto(`dApp's url`);
        await use(page);
    },
});

test("connect wallet to dapp", async ({ page, metamask }) => {
  await page.goto("https://your-dapp.example");
  const connectButton = page.getByRole("button", { name: /Connect/i})
  await connectButton.click();
  await metamask.connectToApp("Account 1");
  await expect(page.getByText("Connected")).toBeVisible();
});
```
> N.B: The wallet fixture will make use of the `default` wallet profile. If you specified a `profile-name` at the point of setting up, make sure to include it in the fixture.

```ts
// No profile name is specified at setup time
const testWithFixture = testWithChainwright(fixture())

// If a profile name is specified at setup time.
const testWithFixture = testWithChainwright(fixture({ profileName: "profile name" }))
```

`Wallet fixture parameters` (Optinoal):
- `profileName`: string,
- `slowMo`: number

## Worker-Scoped Fixture

Use worker-scoped fixtures when you want one wallet context for the duration of a test suite. This is important for saving time on the setup and teardown cost when running tests in CI

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

`Worker scoped fixture parameters` (Optional):

- `profileName?: string`
- `slowMo?: number`
- `dappUrl?: string`

## Wallets By Module

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

## License

MIT
