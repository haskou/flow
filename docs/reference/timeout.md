---
title: Timeout
description: Timeout API reference.
---

# `Timeout`

Rejects work that does not finish before the configured duration.

## Import

```typescript
import { Timeout } from '@haskou/flow';
import { Duration } from '@haskou/value-objects';
```

## Constructor

```typescript
constructor(duration: number | Duration | TimeoutDuration)
```

## Throws

- `InvalidTimeoutDurationError`
- `TimeoutError`
- any error thrown by the task

## Methods

| Method | Description |
| --- | --- |
| `run(task, signal?)` | Runs the task with a timeout and passes an `AbortSignal`. |

## Example

```typescript
await new Timeout(Duration.fromSeconds(3)).run((signal) =>
  fetchSomething({ signal }),
);
```

## Notes

- Timeout aborts the task signal before rejecting with `TimeoutError`.
- Number inputs are interpreted as milliseconds.

## Related

- [Flow](/reference/flow)
- [Errors](/reference/errors)
