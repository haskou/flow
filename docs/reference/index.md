---
title: Reference
description: API reference for @haskou/flow.
---

# Reference

This section documents the public classes exported from `@haskou/flow`.

The main API is organized around async tasks: concurrency, timing, retries, dependency protection, fallback resolution, and composition.

Numeric time arguments are interpreted as milliseconds unless a page says otherwise. Most time options also accept `Duration` from `@haskou/value-objects`.

## Concurrency

| Class | Purpose |
| --- | --- |
| [`Semaphore`](/reference/semaphore) | Limit concurrent access to a shared capacity. |
| [`SemaphorePermit`](/reference/semaphore#semaphorepermit) | Release handle returned by `Semaphore.acquire()`. |
| [`Queue`](/reference/queue) | Run submitted tasks with bounded concurrency. |
| [`QueueOptions`](/reference/queue#queueoptions) | Configure queue concurrency. |

## Timing

| Class | Purpose |
| --- | --- |
| [`RateLimiter`](/reference/rate-limiter) | Space queued task starts by a fixed interval. |
| [`RateLimiterOptions`](/reference/rate-limiter#ratelimiteroptions) | Configure rate limiter interval and queue behavior. |
| [`Timeout`](/reference/timeout) | Reject work that does not finish before a timeout. |
| [`Scheduler`](/reference/scheduler) | Run periodic non-overlapping jobs. |
| [`SchedulerOptions`](/reference/scheduler#scheduleroptions) | Configure scheduler interval, task, policy, and semaphore. |
| [`SchedulerErrorPolicy`](/reference/scheduler#schedulererrorpolicy) | Enum-style policy for scheduler task failures. |
| [`Debouncer`](/reference/debouncer) | Collapse repeated calls into the latest task after a quiet period. |
| [`Throttler`](/reference/throttler) | Run tasks one at a time with a minimum interval between starts. |

## Resilience

| Class | Purpose |
| --- | --- |
| [`CircuitBreaker`](/reference/circuit-breaker) | Reject work after repeated failures and probe recovery later. |
| [`CircuitBreakerOptions`](/reference/circuit-breaker#circuitbreakeroptions) | Configure thresholds, recovery timeout, and half-open concurrency. |
| [`CircuitBreakerState`](/reference/circuit-breaker-state) | Enum-style state object for circuit breaker state. |
| [`Retrier`](/reference/retrier) | Retry failing tasks with configured attempts and optional delay. |
| [`RetryOptions`](/reference/retrier#retryoptions) | Configure retry attempts and delay. |

## Configuration values

These classes are optional. Use them when you want named configuration objects instead of passing numbers directly.

| Class | Purpose |
| --- | --- |
| [`Concurrency`](/reference/value-objects#concurrency) | Positive-integer concurrency limit used by queues and half-open circuit breaker probes. |
| [`SemaphoreCapacity`](/reference/value-objects#semaphorecapacity) | Positive-integer semaphore capacity. |
| [`CircuitBreakerFailureThreshold`](/reference/value-objects#circuitbreakerfailurethreshold) | Positive-integer failure threshold. |
| [`CircuitBreakerRecoveryTimeout`](/reference/value-objects#circuitbreakerrecoverytimeout) | Positive-integer recovery timeout. |
| [`CircuitBreakerSuccessThreshold`](/reference/value-objects#circuitbreakersuccessthreshold) | Positive-integer half-open success threshold. |
| [`RateLimiterInterval`](/reference/value-objects#ratelimiterinterval) | Positive-integer rate-limit interval. |
| [`SchedulerInterval`](/reference/value-objects#schedulerinterval) | Positive-integer scheduler interval. |
| [`DebounceDelay`](/reference/value-objects#debouncedelay) | Positive-integer debounce delay. |
| [`ThrottleInterval`](/reference/value-objects#throttleinterval) | Positive-integer throttle interval. |
| [`RetryAttempts`](/reference/value-objects#retryattempts) | Positive-integer retry attempts. |
| [`RetryDelay`](/reference/value-objects#retrydelay) | Non-negative retry delay. |
| [`TimeoutDuration`](/reference/value-objects#timeoutduration) | Positive-integer timeout duration. |

## Fallbacks and composition

| Class | Purpose |
| --- | --- |
| [`Flow`](/reference/flow) | Fluent builder for task, timeout, retry, limit, abortability, and existing async controls. |
| [`Racer`](/reference/racer) | Run multiple candidates and resolve with the first success. |
| [`Abortable`](/reference/abortable) | Abort running flow work through an `AbortSignal`. |
| [`FallbackChain`](/reference/fallback-chain) | Resolve a value from ordered fallback sources. |
| [`FallbackAttempt`](/reference/fallback-chain#fallbackattempt) | One fallback source inside a chain. |
| [`FlowPipeline`](/reference/flow-pipeline) | Lower-level composition for classes that expose `run(task)`. |

## Errors

See [Errors](/reference/errors) for the full error list and when each one is thrown.
