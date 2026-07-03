---
title: Examples
description: Practical examples for @haskou/flow.
---

# Examples

These examples show the usual ways to coordinate promise-producing work with `@haskou/flow`.

## Limit shared capacity with `Semaphore`

Use a semaphore when several unrelated code paths must share the same capacity.

```typescript
import { Semaphore } from '@haskou/flow';

const providerCapacity = new Semaphore(2);

const user = await providerCapacity.run(() => fetchUserFromProvider(id));
```

## Run submitted work with `Queue`

Use a queue when callers submit work and should wait for their own result.

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

## Rate-limit provider calls

Use `RateLimiter` when task starts must be spaced by a fixed interval.

```typescript
import { QueueOptions, RateLimiter, RateLimiterOptions } from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const limiter = new RateLimiter(
  new RateLimiterOptions(
    Duration.fromMilliseconds(100),
    QueueOptions.withConcurrency(1),
  ),
);

const response = await limiter.run(() => callProvider());
```

## Fail slow work with `Timeout`

Use `Timeout` when a task should not run forever.

```typescript
import { Timeout, TimeoutError } from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const timeout = new Timeout(Duration.fromSeconds(3));

try {
  await timeout.run((signal) => fetchUserFromApi(id, { signal }));
} catch (error) {
  if (error instanceof TimeoutError) {
    await markProviderAsSlow(id);
  }
}
```

## Retry transient failures with `Retrier`

Use `Retrier` around operations that can fail temporarily.

```typescript
import { Retrier, RetryOptions } from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const retrier = new Retrier(
  new RetryOptions(3, Duration.fromMilliseconds(50)),
);

const user = await retrier.run(() => getUserFromRemoteApi(id));
```

## Race alternative sources with `Racer`

Use `Racer` when several sources can produce the same value and the first successful one should win.

```typescript
import { Racer } from '@haskou/flow';

const user = await new Racer<User>()
  .task(() => getUserFromReplicaA(id))
  .task(() => getUserFromReplicaB(id))
  .task(() => getUserFromRemoteApi(id))
  .run();
```

## Retry a race

`Racer` composes well with `Flow`. If all candidates fail, retry the race as a whole.

```typescript
import { Flow, Racer } from '@haskou/flow';

const racer = new Racer<User>()
  .task(() => getUserFromReplicaA(id))
  .task(() => getUserFromReplicaB(id));

const user = await new Flow()
  .race(racer)
  .retry({ attempts: 2 })
  .timeout(500)
  .run();
```

## Abort running work with `Abortable`

Use `Abortable` when the caller must be able to cancel a running task.

```typescript
import { Abortable, Flow } from '@haskou/flow';

const abortable = new Abortable();

const promise = new Flow()
  .task((signal) => fetchUserFromApi(id, { signal }))
  .abortable(abortable)
  .run();

abortable.abort();

await promise;
```

## Collapse bursts with `Debouncer`

Use `Debouncer` when many calls should result in only the latest task running after a quiet period.

```typescript
import { Debouncer } from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const debouncer = new Debouncer<User>(Duration.fromMilliseconds(250));

const first = debouncer.run(() => searchUsers('ha'));
const second = debouncer.run(() => searchUsers('hasko'));

const [firstResult, secondResult] = await Promise.all([first, second]);
```

Both callers receive the result of the latest task.

## Throttle repeated submissions

Use `Throttler` when every task should run, but task starts must be spaced.

```typescript
import { Throttler } from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const throttler = new Throttler(Duration.fromMilliseconds(100));

await Promise.all([
  throttler.run(() => sendMetric('a')),
  throttler.run(() => sendMetric('b')),
]);

await throttler.waitUntilIdle();
```

## Schedule repeated work without overlap

Use `Scheduler` for background jobs where a slow run should skip the next tick instead of overlapping.

```typescript
import {
  Scheduler,
  SchedulerErrorPolicy,
  SchedulerOptions,
} from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const scheduler = new Scheduler(
  new SchedulerOptions(
    Duration.fromSeconds(5),
    () => syncReadModel(),
    SchedulerErrorPolicy.SWALLOW,
  ),
);

scheduler.start();
```

## Protect unstable dependencies with `CircuitBreaker`

Use `CircuitBreaker` around remote APIs, SDKs, or infrastructure calls that should be protected after repeated failures.

```typescript
import { CircuitBreaker, CircuitBreakerOptions } from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const breaker = new CircuitBreaker(
  new CircuitBreakerOptions(3, Duration.fromSeconds(30)),
);

const response = await breaker.run(() => callProvider());
```

## Resolve from fallback sources

Use `FallbackChain` when several sources can return the same value in priority order.

```typescript
import { FallbackChain } from '@haskou/flow';

const user = await new FallbackChain<User>()
  .try(() => getUserFromMemory(id))
  .try(() => getUserFromRedis(id))
  .try(() => getUserFromDatabase(id))
  .try(() => getUserFromRemoteApi(id))
  .run();
```

## Combine several controls with `Flow`

Use `Flow` when one task needs several execution rules and the order should stay visible.

```typescript
import {
  CircuitBreaker,
  CircuitBreakerOptions,
  Flow,
  Semaphore,
} from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const user = await new Flow()
  .task((signal) => fetchUserFromApi(id, { signal }))
  .timeout(Duration.fromSeconds(3))
  .retry({ attempts: 3, delay: Duration.fromMilliseconds(50) })
  .limit(new Semaphore(1))
  .circuitBreaker(
    new CircuitBreaker(new CircuitBreakerOptions(3, Duration.fromSeconds(30))),
  )
  .run();
```

## Low-level composition with `FlowPipeline`

Use `FlowPipeline` for classes that expose `run(task)` and do not need timeout, abortability, or racing.

```typescript
import {
  CircuitBreaker,
  CircuitBreakerOptions,
  FlowPipeline,
  Queue,
  RateLimiter,
  RateLimiterOptions,
} from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const pipeline = new FlowPipeline()
  .through(new Queue())
  .through(new RateLimiter(new RateLimiterOptions(Duration.fromMilliseconds(50))))
  .through(
    new CircuitBreaker(new CircuitBreakerOptions(3, Duration.fromSeconds(30))),
  );

const response = await pipeline.run(() => callProvider());
```
