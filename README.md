# @haskou/flow

[![CI](https://github.com/haskou/flow/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/haskou/flow/actions/workflows/ci.yml?query=branch%3Amaster)
[![codecov](https://codecov.io/gh/haskou/flow/branch/master/graph/badge.svg)](https://codecov.io/gh/haskou/flow)
[![npm version](https://img.shields.io/npm/v/@haskou/flow.svg)](https://www.npmjs.com/package/@haskou/flow)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen?logo=renovatebot)](https://docs.renovatebot.com/)
[![license](https://img.shields.io/npm/l/@haskou/flow.svg)](LICENSE.txt)

A TypeScript library for controlling how async tasks and promises run.

It provides classes for common async coordination problems: limiting concurrency, queueing work, rate limiting calls, enforcing timeouts, retrying failures, racing alternative sources, aborting running work, scheduling jobs, debouncing bursts, throttling calls, opening circuit breakers, and resolving fallback chains.

Use the small classes directly when you only need one behavior, or use `Flow` when one promise-producing task needs several controls at once.


## Documentation

Full documentation is available at **https://haskou.github.io/flow/**.

The documentation includes installation, quick start, examples, error handling, composition notes, and API reference pages.

Reusable agent instructions and engineering skills are available at **https://github.com/haskou/ddd-engineer-skills**.


## Installation

```bash
npm install @haskou/flow
```

```bash
yarn add @haskou/flow
```

## Quick start

```typescript
import {
  CircuitBreaker,
  CircuitBreakerOptions,
  Flow,
  Semaphore,
} from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const semaphore = new Semaphore(2);
const circuitBreaker = new CircuitBreaker(
  new CircuitBreakerOptions(3, Duration.fromSeconds(30)),
);

const result = await new Flow()
  .task((signal) => fetchSomething({ signal }))
  .timeout(Duration.fromSeconds(3))
  .retry({ attempts: 3 })
  .limit(semaphore)
  .circuitBreaker(circuitBreaker)
  .run();
```

Library-specific failures throw specific errors.

```typescript
import {
  CircuitBreaker,
  CircuitBreakerOpenError,
  CircuitBreakerOptions,
} from '@haskou/flow';
import { Duration } from '@haskou/value-objects';

const breaker = new CircuitBreaker(
  new CircuitBreakerOptions(1, Duration.fromSeconds(30)),
);

try {
  await breaker.run(() => callProvider());
} catch (error) {
  if (error instanceof CircuitBreakerOpenError) {
    console.error('Circuit breaker is open');
  }
}
```

Fallback chains resolve a value from ordered sources.

```typescript
import { FallbackChain } from '@haskou/flow';

const user = await new FallbackChain<User>()
  .try(() => getUserFromMemory(id))
  .try(() => getUserFromRedis(id))
  .try(() => getUserFromDatabase(id))
  .try(() => getUserFromRemoteApi(id))
  .run();
```

## Available categories

| Category | Examples |
| --- | --- |
| Concurrency | `Semaphore`, `SemaphorePermit`, `Queue`, `QueueOptions` |
| Timing | `RateLimiter`, `Timeout`, `Scheduler`, `Debouncer`, `Throttler` |
| Resilience | `CircuitBreaker`, `Retrier`, `CircuitBreakerState` |
| Fallbacks | `FallbackChain`, `FallbackAttempt` |
| Composition | `Flow`, `Racer`, `Abortable`, `FlowPipeline` |
| Configuration values | `Concurrency`, `RateLimiterInterval`, `RetryAttempts`, `TimeoutDuration` |
| Errors | `FlowError`, `TimeoutError`, `FlowAbortedError`, `RacerExhaustedError`, validation errors |

See the complete API reference in the documentation: https://haskou.github.io/flow/reference/

## Documentation development

```bash
# Start local docs server
yarn docs:dev

# Build static documentation
yarn docs:build

# Preview the built site
yarn docs:preview
```

## Package development

```bash
yarn install
yarn test
yarn build
```

## Release branches

Publishing is handled by CI when a pull request is merged into the default branch.

| Branch prefix | npm bump |
| --- | --- |
| `fix/*` | Patch |
| `feat/*` | Minor |
| `break/*` | Major |

Branches without one of these prefixes still run CI, but they do not publish to npm.

## License

MIT. See [LICENSE.txt](LICENSE.txt).
