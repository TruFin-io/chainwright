# @tobelabs/chainwright

## 0.9.10

### Patch Changes

- BugFix: Fix bug that prevents wallet actions after copying wallet address

## 0.9.9

### Patch Changes

- Add "confirmDisconnect" action for the Meteor wallet

## 0.9.8

### Patch Changes

- Fix bug in Keplr's onboarding flow that prevents onboarding more than two accounts

## 0.9.7

### Patch Changes

- Add support for "secret Phrase" in "Meteor" and "Keplr" wallets

## 0.9.6

### Patch Changes

- Add "accountName" property for the "onboarding" action in Phantom wallet

## 0.9.5

### Patch Changes

- Fix wallet issues in Petra and Phantom.

## 0.9.4

### Patch Changes

- 16adff1: Make the "walletName" property optional for Onboarding in Solflare wallet

## 0.9.3

### Patch Changes

- Fix the "rename" action for Solflare where current and new account name are the same.

## 0.9.2

### Patch Changes

- Fix TypeScript issue with Solflare's onboarding args

## 0.9.1

### Patch Changes

- Update the "testWithChainwright" function to fix Type-safety

## 0.9.0

### Minor Changes

- Update MetaMask from v13.22.0 to v13.33.0

## 0.8.16

### Patch Changes

- Fix the "getAccountAddress" bug in Metamask and Keplr wallets

## 0.8.15

### Patch Changes

- Update the README.md file

## 0.8.14

### Patch Changes

- Finalize docs

## 0.8.13

### Patch Changes

- Minor update to the docs "README.md"

## 0.8.12

### Patch Changes

- Finalise the README.md docs

## 0.8.11

### Patch Changes

- Update and improve the worker scope fixture across all supported wallets

## 0.8.10

### Patch Changes

- Update the "release.yml" file

## 0.8.9

### Patch Changes

- Update the release workflow file

## 0.8.8

### Patch Changes

- Update the release workflow file

## 0.8.7

### Patch Changes

- Update README.md heading title

## 0.8.6

### Patch Changes

- Update README.md

## 0.8.5

### Patch Changes

- Update README.md file

## 0.8.4

### Patch Changes

- Fix deployment issue

## 0.8.3

### Patch Changes

- Rename the package from "@tobelabs/chainwright" to "chainwright"

## 0.8.2

### Patch Changes

- Fix installation issues with "yarn" and "npm"

## 0.8.1

### Patch Changes

- Fix bug that prevents the creation of multiple wallet profile if the CLI force flag is set to true

## 0.8.0

### Minor Changes

- Rename the "addWallet" args in the onboarding action to "additionalAccounts"

## 0.7.0

### Minor Changes

- Fix pnding Typescript issues happening in metamaskFixture export

## 0.6.1

### Patch Changes

- b511b3f: Begin alpha pre-release series.
- 82a1736: Fix worker scope imports
- 1bee870: Separate wallets into their separate modules

## 0.6.1-alpha.2

### Patch Changes

- Fix worker scope imports

## 0.6.1-alpha.1

### Patch Changes

- Separate wallets into their separate modules

## 0.6.1-alpha.0

### Patch Changes

- Begin alpha pre-release series.

## 0.6.0

### Minor Changes

- Fixing wallet setup function import

## 0.5.0

### Minor Changes

- Fix Directory import

## 0.4.0

### Minor Changes

- Fix shebang file import

## 0.3.3

### Patch Changes

- Fix import path when running the chainwright command

## 0.3.2

### Patch Changes

- Fix the "bin" command issue by removing the sub-command in "client-entry.ts"

## 0.3.1

### Patch Changes

- Fix failing bin command execution

## 0.3.0

### Minor Changes

- Fix Typescript export for "defineWalletSetup"

## 0.2.0

### Minor Changes

- Fix flakiness in CI interactions

## 0.1.0

### Minor Changes

- 4714ad1: Testing releases

### Patch Changes

- a63228b: Updated the package descriptin in "package.json"
