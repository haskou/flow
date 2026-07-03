---
title: Debouncer
description: Debouncer API reference.
---

# `Debouncer`

Delays execution until calls stop arriving for the configured delay.

Use `Debouncer` to collapse noisy repeated calls into one latest operation, such as refresh requests, search indexing triggers, or cache invalidation bursts.

## Import

```typescript
import { Duration } from '@haskou/value-objects';
import { DebounceDelay, Debouncer } from '@haskou/flow';
```

## Signature

```typescript
class Debouncer<T>
```

## Constructor

```typescript
constructor(delay: number | Duration | DebounceDelay)
```

Number inputs are interpreted as milliseconds.

## Validation

The delay accepts a millisecond number, `Duration`, or `DebounceDelay`. Internally, the delay is stored as `DebounceDelay`.

## Throws

This class can throw:

- `InvalidDebouncerDelayError`
- `FlowCancelledError`
- any error thrown by the latest task

## Methods

| Method | Description |
| --- | --- |
| `run(task)` | Schedules `task` after the quiet period. Pending callers resolve with the latest task result. |
| `cancel(error?)` | Cancels pending callers and rejects them with `error` or `FlowCancelledError`. |

## Example

```typescript
import { Debouncer } from '@haskou/flow';

const debouncer = new Debouncer<string>(Duration.fromMilliseconds(250));

const first = debouncer.run(() => 'old');
const second = debouncer.run(() => 'fresh');

await Promise.all([first, second]); // ['fresh', 'fresh']
```

## Cancellation

```typescript
const pending = debouncer.run(() => refresh());

debouncer.cancel();

await pending.catch((error) => {
  if (error instanceof FlowCancelledError) {
    // Pending debounce was cancelled.
  }
});
```

## Notes

- Only the latest task function is executed.
- All pending callers receive the same result or same error.
- Calling `run()` resets the timer.
- Number inputs are interpreted as milliseconds.
- The stored `DebounceDelay` uses `TimerDelay` at the `setTimeout` boundary.
- `cancel()` is safe when no timer is active.

## Related

- [Throttler](/reference/throttler)
- [Errors](/reference/errors)
