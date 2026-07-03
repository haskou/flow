---
title: Basic usage
description: Basic examples for @haskou/flow.
---

# Basic usage

## Limit concurrent work

```typescript
import { Semaphore } from '@haskou/flow';

const semaphore = new Semaphore(2);

await semaphore.runExclusive(async () => {
  await doWork();
});
```

## Queue work

```typescript
import { Queue, QueueOptions } from '@haskou/flow';

const queue = new Queue(QueueOptions.withConcurrency(4));

const result = await queue.enqueue(async () => fetchUser());
await queue.waitUntilIdle();
```

## Schedule without overlap

```typescript
import {
  Scheduler,
  SchedulerErrorPolicy,
  SchedulerOptions,
} from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const scheduler = new Scheduler(
  new SchedulerOptions(
    Duration.fromSeconds(1),
    async () => {
      await syncProjection();
    },
    SchedulerErrorPolicy.SWALLOW,
  ),
);

scheduler.start();
```

## Protect an external dependency

```typescript
import { CircuitBreaker, CircuitBreakerOptions } from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const breaker = new CircuitBreaker(
  new CircuitBreakerOptions(3, Duration.fromSeconds(30)),
);

const response = await breaker.execute(() => callProvider());
```

## Resolve from fallback sources

```typescript
import { FallbackChain } from '@haskou/flow';

const user = await new FallbackChain<User>()
  .try(() => getUserFromMemory(id))
  .try(() => getUserFromRedis(id))
  .try(() => getUserFromDatabase(id))
  .try(() => getUserFromRemoteApi(id))
  .run();
```

## Combine timeout, retry, limits, and circuit breaking

```typescript
import {
  CircuitBreaker,
  CircuitBreakerOptions,
  Flow,
  Semaphore,
} from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const user = await new Flow()
  .task((signal) => getUserFromRemoteApi(id, signal))
  .timeout(Duration.fromSeconds(3))
  .retry({ attempts: 3 })
  .limit(new Semaphore(1))
  .circuitBreaker(new CircuitBreaker(new CircuitBreakerOptions(3, Duration.fromSeconds(30))))
  .run();
```

## Race alternative sources

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
