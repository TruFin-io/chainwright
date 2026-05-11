---
title: Defining a Wallet Setup
description: Author setup files that Chainwright executes to produce wallet profiles.
sidebar:
  order: 1
---

A wallet setup describes the steps Chainwright performs once to produce a reusable wallet profile (imported seed phrase, network configuration, approvals, etc.).

## File location

Place setups under `tests/wallet-setup/`.

## Anatomy

- Imports
- The `defineWalletSetup` call
- The setup body

## Example

```ts
// tests/wallet-setup/basic.setup.ts
```
