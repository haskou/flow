---
title: RateLimiter
description: RateLimiter API reference.
---

# `RateLimiter`

Spaces queued task starts by a fixed interval.

Use `RateLimiter` for APIs or providers that require minimum spacing between calls.

## Import

```typescript
import { Duration } from '@haskou/value-objects';
import {
  QueueOptions,
  RateLimiter,
  RateLimiterInterval,
  RateLimiterOptions,
} from '@haskou/flow';
```

## Signature

```typescript
class RateLimiter
```

## Constructor

```typescript
constructor(options: RateLimiterOptions)
```

## Validation

`RateLimiterOptions` accepts a millisecond number, `Duration`, or `RateLimiterInterval`. Internally, the interval is stored as `RateLimiterInterval`.

## Throws

This class can throw:

- `InvalidRateLimiterIntervalError`
- any error thrown by a scheduled task

## Methods

| Method | Description |
| --- | --- |
| `schedule(task)` | Queues a task and waits for its rate-limit turn before running it. |
| `run(task)` | Alias for `schedule(task)` used by `FlowPipeline`. |
| `waitUntilIdle()` | Resolves when the internal queue is idle. |

## Example

```typescript
import { RateLimiter, RateLimiterOptions } from '@haskou/flow';

const limiter = new RateLimiter(
  new RateLimiterOptions(Duration.fromMilliseconds(100)),
);

await limiter.schedule(() => callProvider());
await limiter.waitUntilIdle();
```

## With queue concurrency

```typescript
const limiter = new RateLimiter(
  new RateLimiterOptions(50, QueueOptions.withConcurrency(1)),
);
```

The queue controls how many tasks may be active in the limiter. The interval controls when each queued task may start.

## `RateLimiterOptions`

Configuration object for `RateLimiter`.

### Signature

```typescript
class RateLimiterOptions
```

### Constructor

```typescript
constructor(
  interval: number | Duration | RateLimiterInterval,
  queueOptions = new QueueOptions(),
)
```

### Methods

| Method | Description |
| --- | --- |
| `getInterval()` | Returns the interval as `RateLimiterInterval`. |
| `getQueueOptions()` | Returns queue options used internally by the limiter. |

## Notes

- The first task runs immediately.
- Later tasks wait until the configured interval has elapsed since the previously reserved start.
- Number inputs are interpreted as milliseconds.
- Use `Flow.rateLimit(rateLimiter)` when rate limiting is one step in a larger flow.

## Related

- [Queue](/reference/queue)
- [Throttler](/reference/throttler)
- [CircuitBreaker](/reference/circuit-breaker)
- [Flow](/reference/flow)
