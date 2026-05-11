---
title: Caching Wallet Profiles
description: How Chainwright caches prepared profiles between runs.
sidebar:
  order: 3
---

Setup is slow; reusing prepared profiles makes test runs fast.

## How caching works

Chainwright fingerprints each setup and reuses the cached profile when the inputs match.

## Forcing a rebuild

Use the `-f` / `--force` flag.

## Cache location

Where cached profiles live, and how to clean them.
