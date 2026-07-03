---
title: Flow
description: Flow API reference.
---

# `Flow`

Builds a runnable async task with visible execution rules.

Use `Flow` when one promise-producing operation needs several controls in a readable order: timeout, retries, semaphore limits, queues, rate limiters, circuit breakers, racers, and abortability.

## Import

```typescript
import { Flow, RetryOptions, Semaphore } from '@haskou/flow';
import { Duration } from '@haskou/value-objects';
```

## Signature

```typescript
class Flow<T = unknown>
```

## Constructor

```typescript
constructor()
```

## Throws

This class can throw:

- `FlowTaskMissingError`
- any error thrown by configured steps
- any error thrown by the task

## Methods

| Method | Description |
| --- | --- |
| `task(task)` | Sets the task to run. The task may receive an `AbortSignal`. |
| `race(racer)` | Sets a `Racer` as the task source. |
| `timeout(duration)` | Adds timeout behavior. |
| `retry(options)` | Adds retry behavior. |
| `limit(semaphore)` | Adds a semaphore limit. |
| `queue(queue)` | Runs the task through a queue. |
| `rateLimit(rateLimiter)` | Runs the task through a rate limiter. |
| `throttle(throttler)` | Runs the task through a throttler. |
| `circuitBreaker(circuitBreaker)` | Runs the task through a circuit breaker. |
| `abortable(abortable)` | Runs the flow through an external `Abortable`. |
| `through(controller)` | Adds a custom step. |
| `run()` | Runs the configured task through all steps. |

## Example

```typescript
const result = await new Flow()
  .task((signal) => fetchSomething({ signal }))
  .timeout(Duration.fromSeconds(3))
  .retry({ attempts: 3 })
  .limit(new Semaphore(1))
  .run();
```

## With racers and retries

```typescript
const racer = new Racer<User>()
  .task(() => getUserFromReplicaA(id))
  .task(() => getUserFromReplicaB(id));

const user = await new Flow()
  .race(racer)
  .retry(new RetryOptions(2))
  .timeout(500)
  .run();
```

## Notes

- Steps are applied in chain order around the task.
- `task()` returns a typed `Flow<TResult>`.
- Existing classes with `run(task)` are adapted through `queue`, `rateLimit`, `throttle`, and `circuitBreaker`.
- Use `abortable()` when callers need to cancel a running flow externally.

## Related

- [Retrier](/reference/retrier)
- [Timeout](/reference/timeout)
- [Racer](/reference/racer)
- [Abortable](/reference/abortable)
