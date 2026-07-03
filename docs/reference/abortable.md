---
title: Abortable
description: Abortable API reference.
---

# `Abortable`

Owns an `AbortController` for cancellable flow-control work.

## Import

```typescript
import { Abortable, Flow } from '@haskou/flow';
```

## Methods

| Method | Description |
| --- | --- |
| `abort()` | Aborts the current signal. |
| `getSignal()` | Returns the owned `AbortSignal`. |
| `run(task)` | Runs a task and rejects with `FlowAbortedError` when aborted. |

## Example

```typescript
const abortable = new Abortable();

const promise = new Flow()
  .task((signal) => fetchSomething({ signal }))
  .abortable(abortable)
  .run();

abortable.abort();

await promise;
```

## Throws

- `FlowAbortedError`
- any error thrown by the task

## Notes

- Abort listeners are removed when the task resolves or rejects.

## Related

- [Flow](/reference/flow)
- [Timeout](/reference/timeout)
