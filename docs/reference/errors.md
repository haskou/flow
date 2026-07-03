---
title: Errors
description: Error reference for @haskou/flow.
---

# Errors

All library-specific errors extend `FlowError`. `FlowError` is an abstract base class; concrete failures are represented by one class per error.

## Import

```typescript
import {
  CircuitBreakerOpenError,
  FallbackChainExhaustedError,
  SchedulerAlreadyRunningError,
} from '@haskou/flow';
```

## Signature

```typescript
abstract class FlowError extends Error
```

## Error list

| Error | Thrown by | Meaning |
| --- | --- | --- |
| `SemaphoreReleasedError` | `SemaphorePermit.release()` | A permit was released more than once. |
| `QueueClearedError` | `Queue.clear()` | Pending queue work was cleared before it started. |
| `CircuitBreakerOpenError` | `CircuitBreaker.execute()`, `CircuitBreaker.run()` | The breaker rejected execution because it is open or half-open concurrency is full. |
| `FlowCancelledError` | `Debouncer.cancel()` | Pending debounce work was cancelled. |
| `FlowAbortedError` | `Abortable.run()`, `Flow.abortable()` | Running work was aborted. |
| `FlowTaskMissingError` | `Flow.run()` | No task was configured before running the flow. |
| `FallbackChainExhaustedError` | `FallbackChain.run()` | No fallback attempt produced a value. |
| `TimeoutError` | `Timeout.run()`, `Flow.timeout()` | Work exceeded its configured timeout. |
| `RacerExhaustedError` | `Racer.run()` | No racer candidate produced a successful value. |
| `SchedulerAlreadyRunningError` | `Scheduler.assertStopped()` | The scheduler is running when stopped state is required. |
| `InvalidSemaphorePermitsError` | `Semaphore` | Permits must be a positive integer. |
| `InvalidQueueConcurrencyError` | `QueueOptions` | Queue concurrency must be a positive integer. |
| `InvalidRateLimiterIntervalError` | `RateLimiterOptions` | Rate limiter interval must be a positive integer. |
| `InvalidSchedulerIntervalError` | `SchedulerOptions` | Scheduler interval must be a positive integer. |
| `InvalidDebouncerDelayError` | `Debouncer` | Debounce delay must be a positive integer. |
| `InvalidThrottlerIntervalError` | `Throttler` | Throttle interval must be a positive integer. |
| `InvalidTimeoutDurationError` | `Timeout` | Timeout duration must be a positive integer. |
| `InvalidRetryAttemptsError` | `RetryOptions` | Retry attempts must be a positive integer. |
| `InvalidRetryDelayError` | `RetryOptions` | Retry delay must be a non-negative integer. |
| `InvalidCircuitBreakerFailureThresholdError` | `CircuitBreakerOptions` | Failure threshold must be a positive integer. |
| `InvalidCircuitBreakerRecoveryTimeoutError` | `CircuitBreakerOptions` | Recovery timeout must be a positive integer. |
| `InvalidCircuitBreakerSuccessThresholdError` | `CircuitBreakerOptions` | Success threshold must be a positive integer. |
| `InvalidCircuitBreakerHalfOpenMaxConcurrentError` | `CircuitBreakerOptions` | Half-open max concurrency must be a positive integer. |

## Example

```typescript
import { CircuitBreakerOpenError } from '@haskou/flow';

try {
  await circuitBreaker.run(() => callProvider());
} catch (error) {
  if (error instanceof CircuitBreakerOpenError) {
    // Dependency is currently protected by the breaker.
  }
}
```

## Validation notes

Numeric configuration values are validated before they are stored. When a value is invalid, the public constructor throws the error class that belongs to that option, such as `InvalidTimeoutDurationError` or `InvalidRetryAttemptsError`.

## Related

- [Reference overview](/reference/)
- [CircuitBreaker](/reference/circuit-breaker)
- [Debouncer](/reference/debouncer)
- [FallbackChain](/reference/fallback-chain)
