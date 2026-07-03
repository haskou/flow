---
title: FallbackChain
description: FallbackChain API reference.
---

# `FallbackChain`

Resolves a value from ordered fallback sources.

Use `FallbackChain` when a value may be available from memory, cache, database, remote APIs, or any ordered set of sources.

## Import

```typescript
import { FallbackAttempt, FallbackChain } from '@haskou/flow';
```

## Signature

```typescript
class FallbackChain<T>
```

## Constructor

```typescript
constructor()
```

## Throws

This class can throw:

- `FallbackChainExhaustedError`

Errors thrown by individual attempts are swallowed so the next fallback source can run.

## Methods

| Method | Description |
| --- | --- |
| `try(attempt)` | Adds an attempt to the chain and returns the chain. |
| `run()` | Runs attempts in order and returns the first non-nullish value. |

## Example

```typescript
const user = await new FallbackChain<User>()
  .try(() => getUserFromMemory(id))
  .try(() => getUserFromRedis(id))
  .try(() => getUserFromDatabase(id))
  .try(() => getUserFromRemoteApi(id))
  .run();
```

## Availability rules

An attempt is considered unavailable when it:

- returns `null`;
- returns `undefined`;
- returns another falsy value such as `false`, `0`, or an empty string;
- throws any error.

The chain stops at the first truthy value.

## `FallbackAttempt`

Wrapper for one attempt in a chain.

### Signature

```typescript
class FallbackAttempt<T>
```

### Constructor

```typescript
constructor(
  attempt: () => Promise<T | null | undefined> | T | null | undefined,
)
```

### Methods

| Method | Description |
| --- | --- |
| `run()` | Runs the attempt and returns its value. |

## Notes

- Empty chains throw `FallbackChainExhaustedError`.
- Attempt errors are intentionally swallowed by `FallbackChain`.
- Falsy values are treated as unavailable values.
- Use explicit logging inside attempts if swallowed errors need observability.

## Related

- [CircuitBreaker](/reference/circuit-breaker)
- [FlowPipeline](/reference/flow-pipeline)
- [Errors](/reference/errors)
