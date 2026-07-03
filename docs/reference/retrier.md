---
title: Retrier
description: Retrier API reference.
---

# `Retrier`

Retries a failing task until it succeeds or attempts are exhausted.

## Import

```typescript
import { Retrier, RetryOptions } from '@haskou/flow';
```

## Constructor

```typescript
constructor(options = new RetryOptions())
```

## Validation

`RetryOptions` stores attempts as `RetryAttempts` and delay as `RetryDelay`.

## Throws

- `InvalidRetryAttemptsError`
- `InvalidRetryDelayError`
- `FlowAbortedError` when aborted while waiting between attempts
- the last error thrown by the task

## Methods

| Method | Description |
| --- | --- |
| `run(task, signal?)` | Runs and retries the task. |

## Example

```typescript
const value = await new Retrier(new RetryOptions(3)).run(() => callProvider());
```

## `RetryOptions`

### Constructor

```typescript
constructor(attempts = RetryAttempts.ONCE, delay = RetryDelay.none())
```

### Methods

| Method | Description |
| --- | --- |
| `getAttempts()` | Returns `RetryAttempts`. |
| `getDelay()` | Returns `RetryDelay`. |

## Related

- [Flow](/reference/flow)
- [Racer](/reference/racer)
- [Errors](/reference/errors)
