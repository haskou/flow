---
title: FlowPipeline
description: FlowPipeline API reference.
---

# `FlowPipeline`

Composes classes that expose `run(task)`.

Use `FlowPipeline` for the older, lower-level composition style based on `run(task)`. For new code that needs timeout, retry, racing, or abortability, prefer [`Flow`](/reference/flow).

## Import

```typescript
import { FlowPipeline } from '@haskou/flow';
```

## Signature

```typescript
class FlowPipeline
```

## Constructor

```typescript
constructor()
```

## Compatible classes

Any object with this method is compatible:

```typescript
run<T>(task: () => Promise<T> | T): Promise<T>
```

Built-in compatible classes:

- `Semaphore`
- `Queue`
- `RateLimiter`
- `Throttler`
- `CircuitBreaker`

## Methods

| Method | Description |
| --- | --- |
| `through(controller)` | Adds a class with `run(task)` and returns the pipeline. |
| `run(task)` | Runs the task through all configured steps in registration order. |

## Example

```typescript
const pipeline = new FlowPipeline()
  .through(new Queue())
  .through(new RateLimiter(new RateLimiterOptions(Duration.fromMilliseconds(50))))
  .through(new CircuitBreaker(new CircuitBreakerOptions(3, Duration.fromSeconds(30))));

const value = await pipeline.run(() => callProvider());
```

## Execution order

Steps are applied in registration order.

```typescript
new FlowPipeline()
  .through(queue)
  .through(rateLimiter)
  .through(circuitBreaker);
```

This means:

1. The work enters `queue`.
2. The queued task enters `rateLimiter`.
3. The rate-limited task enters `circuitBreaker`.
4. The original task runs if every controller allows it.

## Scheduler usage

```typescript
const pipeline = new FlowPipeline()
  .through(new Queue())
  .through(new CircuitBreaker(new CircuitBreakerOptions(3, Duration.fromSeconds(30))));

const scheduler = new Scheduler(
  new SchedulerOptions(
    Duration.fromSeconds(5),
    () => pipeline.run(() => syncProvider()),
  ),
);
```

## Notes

- `FlowPipeline` does not own lifecycle for the classes it wraps.
- `waitUntilIdle()` remains on individual classes that expose it.
- Empty pipelines run the task directly.

## Related

- [Queue](/reference/queue)
- [RateLimiter](/reference/rate-limiter)
- [CircuitBreaker](/reference/circuit-breaker)
- [Scheduler](/reference/scheduler)
