---
title: Scheduler
description: Scheduler API reference.
---

# `Scheduler`

Runs a periodic task without overlapping executions.

Use `Scheduler` for polling, projection rebuilds, cache refreshes, sync jobs, or other repeated background work where a slow run should not overlap with the next tick.

## Import

```typescript
import {
  Scheduler,
  SchedulerErrorPolicy,
  SchedulerInterval,
  SchedulerOptions,
  Semaphore,
} from '@haskou/flow';
import { Duration } from '@haskou/value-objects';
```

## Signature

```typescript
class Scheduler
```

## Constructor

```typescript
constructor(options: SchedulerOptions)
```

## Validation

`SchedulerOptions` accepts a millisecond number, `Duration`, or `SchedulerInterval`. Internally, the interval is stored as `SchedulerInterval`.

## Throws

This class can throw:

- `InvalidSchedulerIntervalError`
- `SchedulerAlreadyRunningError`
- any error thrown by the scheduled task when the error policy is `THROW`

## Methods

| Method | Description |
| --- | --- |
| `start()` | Starts periodic execution. Idempotent: calling it again while running is a no-op. |
| `stop()` | Stops periodic execution. Calling it while stopped is a no-op. |
| `isRunning()` | Returns whether the interval timer is active. |
| `runOnce()` | Attempts one non-overlapping execution. Returns `false` when another run is active. |
| `assertStopped()` | Throws `SchedulerAlreadyRunningError` when the scheduler is running. |

## Example

```typescript
const scheduler = new Scheduler(
  new SchedulerOptions(Duration.fromSeconds(1), async () => {
    await syncReadModel();
  }),
);

scheduler.start();
```

## Non-overlapping behavior

`Scheduler` uses a `Semaphore` internally. If a previous run is still active, `runOnce()` returns `false` and the new run is skipped.

```typescript
const executed = await scheduler.runOnce();

if (executed === false) {
  // Previous run is still active.
}
```

## Shared semaphore

```typescript
const semaphore = new Semaphore(1);

const scheduler = new Scheduler(
  new SchedulerOptions(5_000, rebuildProjection, SchedulerErrorPolicy.THROW, semaphore),
);
```

Use a shared semaphore when several schedulers or manual tasks must share the same non-overlap boundary.

## `SchedulerOptions`

Configuration object for `Scheduler`.

### Signature

```typescript
class SchedulerOptions
```

### Constructor

```typescript
constructor(
  interval: number | Duration | SchedulerInterval,
  task: () => Promise<void> | void,
  errorPolicy = SchedulerErrorPolicy.THROW,
  semaphore = new Semaphore(1),
)
```

### Methods

| Method | Description |
| --- | --- |
| `getErrorPolicy()` | Returns the configured error policy. |
| `getInterval()` | Returns the interval as `SchedulerInterval`. |
| `getSemaphore()` | Returns the semaphore used for non-overlap. |
| `getTask()` | Returns the scheduled task. |

## `SchedulerErrorPolicy`

Enum-style value object backed by `@haskou/value-objects`.

### Values

- `SchedulerErrorPolicy.THROW`
- `SchedulerErrorPolicy.SWALLOW`

### Methods

| Method | Description |
| --- | --- |
| `fromPrimitives(value)` | Hydrates a policy from a primitive string. |
| `getValues()` | Returns allowed primitive values. |
| `isThrow()` | Returns true for `THROW`. |
| `isSwallow()` | Returns true for `SWALLOW`. |

## Notes

- `start()` uses `setInterval` through `TimerDelay`; primitive milliseconds stay at that timer boundary.
- `start()` is intentionally idempotent. Use `assertStopped()` when a caller needs to enforce stopped state before continuing.
- Number inputs are interpreted as milliseconds.
- Task errors are swallowed only when policy is `SchedulerErrorPolicy.SWALLOW`.
- `runOnce()` is useful for tests and manual job triggers.

## Related

- [Semaphore](/reference/semaphore)
- [FlowPipeline](/reference/flow-pipeline)
- [Errors](/reference/errors)
