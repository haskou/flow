---
title: Introduction
description: Introduction to @haskou/flow.
---

# Introduction

`@haskou/flow` provides dependency-light classes for coordinating async work in TypeScript services.

Use it when promise-producing work needs rules around when it starts, how often it runs, how long it may take, how failures are retried, or which fallback source should be used.

The main classes are:

- `Semaphore` to share a fixed concurrency capacity across unrelated code paths.
- `Queue` to run submitted tasks with bounded concurrency.
- `RateLimiter` and `Throttler` to space task starts over time.
- `Timeout` to fail work that takes too long.
- `Retrier` to retry transient failures.
- `Racer` to run alternative async sources and keep the first successful result.
- `Abortable` to cancel running work.
- `Scheduler` to run repeated jobs without overlap.
- `Debouncer` to collapse bursts into one latest task.
- `CircuitBreaker` to protect unstable dependencies.
- `FallbackChain` to read from ordered sources such as memory, Redis, database, and remote API.
- `Flow` to combine several controls around one task.

Numbers are accepted at public boundaries where they are convenient. Time values can also be passed as `Duration` from `@haskou/value-objects`.
