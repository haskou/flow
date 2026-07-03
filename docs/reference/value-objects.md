---
title: Configuration values
description: Explicit configuration value reference.
---

# Configuration values

Most constructors in `@haskou/flow` accept plain numbers for convenience. Numbers that represent time are interpreted as milliseconds.

When you want stronger names in application code, you can pass explicit configuration values instead. They are especially useful when a value is created once and reused across several queues, schedulers, flows, or circuit breakers.

## Import

```typescript
import {
  Concurrency,
  RateLimiterInterval,
  RetryAttempts,
  RetryDelay,
  TimeoutDuration,
} from '@haskou/flow';
import { Duration } from '@haskou/value-objects';
```

## Common examples

### Concurrency

```typescript
import { Concurrency, Queue, QueueOptions } from '@haskou/flow';

const concurrency = new Concurrency(4);
const queue = new Queue(QueueOptions.withConcurrency(concurrency));
```

### Time values

```typescript
import {
  RateLimiterInterval,
  RateLimiterOptions,
  Timeout,
  TimeoutDuration,
} from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const rateLimiterOptions = new RateLimiterOptions(
  new RateLimiterInterval(Duration.fromMilliseconds(100)),
);

const timeout = new Timeout(new TimeoutDuration(Duration.fromSeconds(3)));
```

### Retry values

```typescript
import { Retrier, RetryAttempts, RetryDelay, RetryOptions } from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const retrier = new Retrier(
  new RetryOptions(
    new RetryAttempts(3),
    new RetryDelay(Duration.fromMilliseconds(50)),
  ),
);
```

## Concurrency values

| Class | Used by | Meaning |
| --- | --- | --- |
| `Concurrency` | `QueueOptions`, `CircuitBreakerOptions` | Maximum active work allowed. |
| `SemaphoreCapacity` | `Semaphore` | Total number of semaphore permits. |

## Timing values

| Class | Used by | Meaning |
| --- | --- | --- |
| `RateLimiterInterval` | `RateLimiterOptions` | Minimum spacing between reserved task starts. |
| `SchedulerInterval` | `SchedulerOptions` | Delay between scheduler ticks. |
| `DebounceDelay` | `Debouncer` | Quiet period before the latest task runs. |
| `ThrottleInterval` | `Throttler` | Minimum spacing between throttled task starts. |
| `TimeoutDuration` | `Timeout`, `Flow.timeout()` | Maximum duration allowed before timeout. |
| `CircuitBreakerRecoveryTimeout` | `CircuitBreakerOptions` | How long an open circuit breaker waits before half-open probing. |
| `RetryDelay` | `RetryOptions` | Delay between retry attempts. |

## Retry values

| Class | Used by | Meaning |
| --- | --- | --- |
| `RetryAttempts` | `RetryOptions` | Total attempts before the last error is rethrown. |
| `RetryAttemptCount` | `Retrier` internals | Current attempt count. Exported for advanced integrations. |

## Circuit breaker values

| Class | Used by | Meaning |
| --- | --- | --- |
| `CircuitBreakerFailureThreshold` | `CircuitBreakerOptions` | Failures required to open the circuit. |
| `CircuitBreakerSuccessThreshold` | `CircuitBreakerOptions` | Successful half-open probes required to close the circuit. |
| `CircuitBreakerRecoveryTimeout` | `CircuitBreakerOptions` | Time before open state can move to half-open. |

## Advanced internal state values

These classes are exported because they are part of the package surface, but most applications do not need to instantiate them directly.

| Class | Meaning |
| --- | --- |
| `SemaphorePermits` | Current available semaphore permits. |
| `CircuitBreakerFailureCount` | Consecutive failure count. |
| `CircuitBreakerSuccessCount` | Successful half-open probe count. |
| `CircuitBreakerProbeCount` | Active half-open probe count. |
| `CircuitBreakerOpenedAt` | Timestamp captured when a circuit breaker opens. |
| `NextRunAt` | Next reserved start time for rate limiters and throttlers. |
| `NextRunReservation` | Reservation result containing delay and next start time. |
| `TimerDelay` | Boundary object that owns conversion to Node timer APIs. |

## Notes

- Prefer numbers for simple call sites: `new Timeout(3000)` is fine.
- Prefer `Duration` when readability matters: `new Timeout(Duration.fromSeconds(3))`.
- Prefer explicit configuration values when values are shared, named, or built outside the constructor call.
