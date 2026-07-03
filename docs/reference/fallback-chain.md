---
title: FallbackChain
description: FallbackChain API reference.
---

# `FallbackChain`

Resolves a value from ordered fallback sources.

Use `FallbackChain` when a value may be available from memory, cache, database, remote APIs, or any ordered set of sources.

## Import

```typescript
import {
  FallbackAttempt,
  FallbackChain,
  FallbackChainOptions,
} from '@haskou/flow';
```

## Signature

```typescript
class FallbackChain<T>
```

## Constructor

```typescript
constructor(options = FallbackChainOptions.default())
```

## Throws

This class can throw:

- `FallbackChainExhaustedError`
- any error thrown by an attempt, unless `catchErrors` is enabled

## Methods

| Method | Description |
| --- | --- |
| `try(attempt)` | Adds an attempt to the chain and returns the chain. |
| `onError(handler)` | Registers a handler called when an attempt throws. |
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

By default, an attempt is considered unavailable only when it:

- returns `null`;
- returns `undefined`.

Values such as `false`, `0`, and an empty string are valid results.

Attempt errors are propagated by default. Enable `FallbackChainOptions.catchingErrors()` for best-effort fallback behavior.

```typescript
const user = await new FallbackChain<User>(
  FallbackChainOptions.catchingErrors(),
)
  .onError((error) => logger.warn(error))
  .try(() => getUserFromRedis(id))
  .try(() => getUserFromDatabase(id))
  .run();
```

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
- Attempt errors are not swallowed unless catch mode is enabled.
- Use `onError()` when catch mode needs observability.

## Related

- [CircuitBreaker](/reference/circuit-breaker)
- [FlowPipeline](/reference/flow-pipeline)
- [Errors](/reference/errors)
