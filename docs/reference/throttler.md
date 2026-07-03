---
title: Throttler
description: Throttler API reference.
---

# `Throttler`

Runs tasks one at a time while keeping at least the configured interval between starts.

Use `Throttler` when every submitted task should run, but not too frequently.

## Import

```typescript
import { Duration } from '@haskou/value-objects';
import { ThrottleInterval, Throttler } from '@haskou/flow';
```

## Signature

```typescript
class Throttler
```

## Constructor

```typescript
constructor(interval: number | Duration | ThrottleInterval)
```

Number inputs are interpreted as milliseconds.

## Validation

The interval accepts a millisecond number, `Duration`, or `ThrottleInterval`. Internally, the interval is stored as `ThrottleInterval`.

## Throws

This class can throw:

- `InvalidThrottlerIntervalError`
- any error thrown by a throttled task

## Methods

| Method | Description |
| --- | --- |
| `run(task)` | Queues a task and runs it when the throttle interval allows. |
| `waitUntilIdle()` | Resolves when the internal queue is idle. |

## Example

```typescript
import { Throttler } from '@haskou/flow';

const throttler = new Throttler(Duration.fromMilliseconds(100));

await Promise.all([
  throttler.run(() => callApi('a')),
  throttler.run(() => callApi('b')),
]);

await throttler.waitUntilIdle();
```

## Notes

- `Throttler` uses an internal one-at-a-time queue.
- The first task runs immediately.
- Later tasks wait until the minimum interval has elapsed.
- The stored `ThrottleInterval` uses `TimerDelay` at the timer boundary.
- Unlike `Debouncer`, every task is eventually run unless its task rejects.

## Related

- [Debouncer](/reference/debouncer)
- [RateLimiter](/reference/rate-limiter)
- [Queue](/reference/queue)
