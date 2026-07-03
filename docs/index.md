---
title: Documentation
description: Documentation for @haskou/flow.
---

# Flow documentation

A TypeScript library for controlling how async tasks and promises run.

::: info Documentation
This site is the main documentation for `@haskou/flow`.
Use it for installation, examples, composition notes, errors, and API reference.
:::

## Start here

- [Introduction](/getting-started/introduction)
- [Installation](/getting-started/installation)
- [Basic usage](/getting-started/basic-usage)
- [Guide](/guides/)
- [API reference](/reference/)

## Package

```bash
npm install @haskou/flow
```

```bash
yarn add @haskou/flow
```

## Reference sections

| Section | Contents |
| --- | --- |
| [Concurrency](/reference/semaphore) | `Semaphore`, `Queue` |
| [Timing](/reference/rate-limiter) | `RateLimiter`, `Timeout`, `Scheduler`, `Debouncer`, `Throttler` |
| [Resilience](/reference/circuit-breaker) | `CircuitBreaker`, `Retrier` |
| [Composition](/reference/flow) | `Flow`, `Racer`, `Abortable`, `FallbackChain`, `FlowPipeline` |
| [Errors](/reference/errors) | Library-specific error classes |
