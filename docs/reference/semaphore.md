---
title: Semaphore
description: Semaphore API reference.
---

# `Semaphore`

Limits concurrent access to a shared capacity.

Use `Semaphore` when unrelated callers must share a finite number of permits, such as provider connections, filesystem workers, expensive CPU work, or non-overlapping schedulers.

## Import

```typescript
import { Semaphore, SemaphorePermit } from '@haskou/flow';
```

## Signature

```typescript
class Semaphore
```

## Constructor

```typescript
constructor(permits: number)
```

`permits` must be a positive integer.

## Validation

`permits` is validated as a positive integer. `0`, negative numbers, non-integers, and invalid numbers are rejected.

## Throws

This class can throw:

- `InvalidSemaphorePermitsError`
- `SemaphoreReleasedError`

## Methods

| Method | Description |
| --- | --- |
| `acquire(signal?)` | Resolves with a `SemaphorePermit` when a permit is available. Waits when all permits are in use. |
| `tryAcquire()` | Returns a `SemaphorePermit` immediately, or `null` when no permit is available. |
| `runExclusive(task)` | Acquires one permit, runs `task`, and releases the permit in a `finally` block. |
| `run(task)` | Alias for `runExclusive(task)` used by `FlowPipeline`. |
| `getCapacity()` | Returns the total permit capacity. |
| `getAvailablePermits()` | Returns currently available permits. |
| `getWaitingCount()` | Returns the number of callers waiting in `acquire()`. |

## Example

```typescript
import { Semaphore } from '@haskou/flow';

const semaphore = new Semaphore(2);

await Promise.all([
  semaphore.runExclusive(() => uploadChunk('a')),
  semaphore.runExclusive(() => uploadChunk('b')),
  semaphore.runExclusive(() => uploadChunk('c')),
]);
```

Only two tasks run at once. The third waits until a permit is released.

## Manual permit management

```typescript
const permit = await semaphore.acquire();

try {
  await work();
} finally {
  permit.release();
}
```

Releasing the same permit twice throws `SemaphoreReleasedError`.

## Aborting a waiter

```typescript
const controller = new AbortController();
const permitPromise = semaphore.acquire(controller.signal);

controller.abort();

await permitPromise; // rejects with FlowAbortedError
```

Aborted waiters are removed from the semaphore queue.

## Pipeline usage

```typescript
const pipeline = new FlowPipeline().through(new Semaphore(1));

await pipeline.run(() => rebuildProjection());
```

## `SemaphorePermit`

Release handle returned by `Semaphore.acquire()` and `Semaphore.tryAcquire()`.

### Signature

```typescript
class SemaphorePermit
```

### Methods

| Method | Description |
| --- | --- |
| `release()` | Releases the permit exactly once. |

## Notes

- `runExclusive()` and `run()` are safer than manual `acquire()` for most use cases.
- `tryAcquire()` is useful for skip semantics, as used by `Scheduler`.
- Waiters are resumed in FIFO order.

## Related

- [Queue](/reference/queue)
- [Scheduler](/reference/scheduler)
- [FlowPipeline](/reference/flow-pipeline)
- [Errors](/reference/errors)
