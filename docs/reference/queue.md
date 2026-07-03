---
title: Queue
description: Queue API reference.
---

# `Queue`

Runs submitted tasks with bounded concurrency.

Use `Queue` when callers should wait their turn and receive the result of their own task.

## Import

```typescript
import { Concurrency, Queue, QueueOptions } from '@haskou/flow';
```

## Signature

```typescript
class Queue
```

## Constructor

```typescript
constructor(options = new QueueOptions())
```

## Validation

`QueueOptions` accepts a positive-integer number or `Concurrency`. Internally, concurrency is stored as `Concurrency`.

## Throws

This class can throw:

- `InvalidQueueConcurrencyError`
- `QueueClearedError`
- any error thrown by an enqueued task

## Methods

| Method | Description |
| --- | --- |
| `enqueue(task)` | Adds a task to the queue and resolves or rejects with that task result. |
| `run(task)` | Alias for `enqueue(task)` used by `FlowPipeline`. |
| `clear(error?)` | Rejects all pending tasks that have not started. Active tasks continue. |
| `waitUntilIdle()` | Resolves when there are no active or pending tasks. |
| `getConcurrency()` | Returns configured `Concurrency`. |
| `getPendingCount()` | Returns tasks waiting to start. |
| `getActiveCount()` | Returns tasks currently running. |

## Example

```typescript
import { Queue, QueueOptions } from '@haskou/flow';

const queue = new Queue(QueueOptions.withConcurrency(4));

const users = await Promise.all([
  queue.enqueue(() => fetchUser('1')),
  queue.enqueue(() => fetchUser('2')),
  queue.enqueue(() => fetchUser('3')),
]);

await queue.waitUntilIdle();
```

## Clearing pending work

```typescript
import { Queue, QueueClearedError } from '@haskou/flow';

const queue = new Queue();
const pending = queue.enqueue(() => slowWork());

queue.clear();

await pending.catch((error) => {
  if (error instanceof QueueClearedError) {
    // Pending work was cancelled before it started.
  }
});
```

## `QueueOptions`

Configuration object for `Queue`.

### Signature

```typescript
class QueueOptions
```

### Constructor

```typescript
constructor(concurrency: number | Concurrency = Concurrency.DEFAULT)
```

### Factories

| Factory | Description |
| --- | --- |
| `QueueOptions.withConcurrency(concurrency)` | Creates options with explicit concurrency. |

### Methods

| Method | Description |
| --- | --- |
| `getConcurrency()` | Returns configured `Concurrency`. |

## Notes

- `clear()` only rejects pending tasks. It does not abort tasks already running.
- `waitUntilIdle()` is a promise-based completion signal, not an event subscription.
- Use `run()` when composing with `FlowPipeline`; use `Flow.queue(queue)` for fluent composition.

## Related

- [RateLimiter](/reference/rate-limiter)
- [Throttler](/reference/throttler)
- [Flow](/reference/flow)
- [Errors](/reference/errors)
