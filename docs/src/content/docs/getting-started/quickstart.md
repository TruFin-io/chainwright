---
title: Quickstart
description: From install to a running wallet test in a few minutes.
sidebar:
  order: 2
---

A minimal end-to-end walkthrough.

## 1. Install

See [Installation](/getting-started/installation/).

## 2. Define a wallet setup

Create `tests/wallet-setup/basic.setup.ts`:

```ts
// TODO: define your wallet setup
```

## 3. Run the CLI

```bash
npx chainwright ./tests/wallet-setup
```

## 4. Use it in your tests

Reference the prepared wallet fixture in your Playwright spec.
