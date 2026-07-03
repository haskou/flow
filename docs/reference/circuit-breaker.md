---
title: CircuitBreaker
description: CircuitBreaker API reference.
---

# `CircuitBreaker`

Rejects work after repeated failures and later allows probe calls in half-open state.

Use `CircuitBreaker` around unstable external dependencies such as remote APIs, provider SDKs, or infrastructure calls.

## Import

```typescript
import {
  CircuitBreaker,
  CircuitBreakerOptions,
  CircuitBreakerRecoveryTimeout,
  CircuitBreakerState,
} from '@haskou/flow';
import { Duration } from '@haskou/value-objects';
```

## Signature

```typescript
class CircuitBreaker
```

## Constructor

```typescript
constructor(options: CircuitBreakerOptions)
```

## Validation

`CircuitBreakerOptions` validates thresholds and concurrency as positive integers. Recovery timeout accepts a millisecond number, `Duration`, or `CircuitBreakerRecoveryTimeout`.

## Throws

This class can throw:

- `CircuitBreakerOpenError`
- `InvalidCircuitBreakerFailureThresholdError`
- `InvalidCircuitBreakerRecoveryTimeoutError`
- `InvalidCircuitBreakerSuccessThresholdError`
- `InvalidCircuitBreakerHalfOpenMaxConcurrentError`
- any error thrown by the protected task

## Methods

| Method | Description |
| --- | --- |
| `execute(task)` | Runs a protected task when the breaker allows it. |
| `run(task)` | Alias for `execute(task)` used by `FlowPipeline`. |
| `reset()` | Closes the breaker and resets counters. |
| `getState()` | Returns the current `CircuitBreakerState`, moving to half-open when recovery timeout elapsed. |
| `getFailureCount()` | Returns current consecutive failure count. |

## Example

```typescript
const breaker = new CircuitBreaker(
  new CircuitBreakerOptions(3, Duration.fromSeconds(30)),
);

const response = await breaker.execute(() => callProvider());
```

## State transitions

| From | Event | To |
| --- | --- | --- |
| `closed` | failure count reaches threshold | `open` |
| `open` | recovery timeout elapsed | `half-open` |
| `half-open` | success count reaches threshold | `closed` |
| `half-open` | any probe fails | `open` |

## Half-open concurrency

```typescript
const breaker = new CircuitBreaker(
  new CircuitBreakerOptions(3, 30_000, 2, 1),
);
```

The fourth argument limits concurrent half-open probe calls. Extra probes throw `CircuitBreakerOpenError`.

## `CircuitBreakerOptions`

Configuration object for `CircuitBreaker`.

### Signature

```typescript
class CircuitBreakerOptions
```

### Constructor

```typescript
constructor(
  failureThreshold: number,
  recoveryTimeout: number | Duration | CircuitBreakerRecoveryTimeout,
  successThreshold = 1,
  halfOpenMaxConcurrent = 1,
)
```

### Methods

| Method | Description |
| --- | --- |
| `getFailureThreshold()` | Returns failures needed to open the breaker. |
| `getRecoveryTimeout()` | Returns timeout before open state can become half-open as `CircuitBreakerRecoveryTimeout`. |
| `getSuccessThreshold()` | Returns half-open successes needed to close the breaker. |
| `getHalfOpenMaxConcurrent()` | Returns maximum concurrent half-open probes. |

## Notes

- Closed-state success resets failure count.
- Open-state calls are rejected before running the task.
- `getState()` may move the breaker from open to half-open when timeout elapsed.
- Recovery timeout is stored as `CircuitBreakerRecoveryTimeout`; number inputs are interpreted as milliseconds.
- Use `run()` when composing with `FlowPipeline`.

## Related

- [CircuitBreakerState](/reference/circuit-breaker-state)
- [FlowPipeline](/reference/flow-pipeline)
- [Errors](/reference/errors)
