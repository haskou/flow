---
title: Guide
description: Guide for @haskou/flow.
---

# Guide

`@haskou/flow` classes are intentionally small. Compose them near the async task that needs coordination instead of hiding global behavior in infrastructure code.

Use a `Queue` when submitted tasks should wait their turn. Use a `Semaphore` when unrelated code paths need to share capacity. Use `Retrier`, `Timeout`, and `CircuitBreaker` around unreliable dependencies, not around pure in-process logic.

## Guides

- [Examples](/guides/examples)
- [Composition](/guides/composition)
- [Error handling](/guides/error-handling)
