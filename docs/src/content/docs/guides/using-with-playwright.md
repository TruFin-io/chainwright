---
title: Using with Playwright
description: Wire Chainwright fixtures into a Playwright test suite.
sidebar:
  order: 2
---

How to consume Chainwright-prepared wallet profiles from a Playwright test.

## Project config

`playwright.config.ts` adjustments.

## Test-level fixture

```ts
import { testWithChainwright } from "chainwright";
```

## Running the suite

```bash
bun run tests:e2e
```
