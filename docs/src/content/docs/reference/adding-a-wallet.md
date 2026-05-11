---
title: Adding a Wallet
description: Contribute first-class support for a new wallet to Chainwright.
sidebar:
  order: 4
---

How to add a new wallet to Chainwright. Mirrors the `scripts/add-wallet.ts` flow.

## 1. Scaffold the wallet module

```bash
bun run add:wallet
```

## 2. Implement the setup steps

Network metadata, install flow, and approval handlers.

## 3. Register the wallet

Wire it into `src/wallets/index.ts`.

## 4. Document it

Add a page under `wallets/` and link it from the [overview](/wallets/overview/).
