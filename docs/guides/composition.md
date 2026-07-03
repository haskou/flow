---
title: Composition
description: Compose @haskou/flow classes.
---

# Composition

The classes are designed to layer cleanly around promise-producing tasks.

## Fluent flow

```typescript
import { Flow, Semaphore } from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const value = await new Flow()
  .task((signal) => callProvider({ signal }))
  .timeout(Duration.fromSeconds(3))
  .retry({ attempts: 3 })
  .limit(new Semaphore(1))
  .run();
```

Use `Flow` when one task needs several controls and the order should stay visible at the call site.

## Scheduler with a shared semaphore

```typescript
import {
  Scheduler,
  SchedulerErrorPolicy,
  SchedulerOptions,
  Semaphore,
} from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const semaphore = new Semaphore(1);

const scheduler = new Scheduler(
  new SchedulerOptions(Duration.fromSeconds(5), async () => {
    await rebuildReadModel();
  }, SchedulerErrorPolicy.THROW, semaphore),
);
```

## Rate-limited queue

```typescript
import { QueueOptions, RateLimiter, RateLimiterOptions } from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const limiter = new RateLimiter(
  new RateLimiterOptions(
    Duration.fromMilliseconds(50),
    QueueOptions.withConcurrency(1),
  ),
);

await limiter.schedule(() => callProvider());
```

## Pipeline

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
  .through(new CircuitBreaker(new CircuitBreakerOptions(3, Duration.fromSeconds(30))));

await pipeline.run(() => callProvider());
```

`FlowPipeline` is the lower-level composition object for classes that expose `run(task)`. Prefer `Flow` for new code that needs timeout, retry, racing, or abortability.
