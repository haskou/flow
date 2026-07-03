import { Duration, Timestamp } from '@haskou/value-objects';

import {
  ActiveTaskCount,
  CircuitBreakerFailureCount,
  CircuitBreakerFailureThreshold,
  CircuitBreakerOpenedAt,
  CircuitBreakerOptions,
  CircuitBreakerProbeCount,
  CircuitBreakerRecoveryTimeout,
  CircuitBreakerSuccessThreshold,
  Concurrency,
  Debouncer,
  DebounceDelay,
  FlowCancelledError,
  InvalidFlowCountError,
  InvalidPositiveDurationValueError,
  InvalidPositiveIntegerValueError,
  InvalidNonNegativeDurationValueError,
  NextRunAt,
  PendingDebounceTask,
  QueueOptions,
  RateLimiterInterval,
  RateLimiterOptions,
  RetryDelay,
  SchedulerInterval,
  SchedulerOptions,
  Semaphore,
  SemaphoreCapacity,
  SemaphorePermits,
  ThrottleInterval,
  Throttler,
  TimerDelay,
} from '../../src';

describe('flow-control value objects', () => {
  it('accepts flow value objects at public option boundaries', () => {
    const concurrency = new Concurrency(2);
    const failureThreshold = new CircuitBreakerFailureThreshold(3);
    const successThreshold = new CircuitBreakerSuccessThreshold(2);
    const recoveryTimeout = new CircuitBreakerRecoveryTimeout(
      Duration.fromMilliseconds(10),
    );
    const halfOpenMaxConcurrent = new Concurrency(1);
    const circuitBreakerOptions = new CircuitBreakerOptions(
      failureThreshold,
      recoveryTimeout,
      successThreshold,
      halfOpenMaxConcurrent,
    );

    expect(QueueOptions.withConcurrency(concurrency).getConcurrency()).toBe(
      concurrency,
    );
    expect(circuitBreakerOptions.getFailureThreshold()).toBe(failureThreshold);
    expect(circuitBreakerOptions.getRecoveryTimeout()).toBe(recoveryTimeout);
    expect(circuitBreakerOptions.getSuccessThreshold()).toBe(successThreshold);
    expect(circuitBreakerOptions.getHalfOpenMaxConcurrent()).toBe(
      halfOpenMaxConcurrent,
    );
  });

  it('accepts flow duration value objects at public option boundaries', () => {
    const rateLimiterInterval = new RateLimiterInterval(
      Duration.fromMilliseconds(10),
    );
    const schedulerInterval = new SchedulerInterval(
      Duration.fromMilliseconds(10),
    );
    const debounceDelay = new DebounceDelay(Duration.fromMilliseconds(10));
    const throttleInterval = new ThrottleInterval(Duration.fromMilliseconds(10));

    expect(
      new RateLimiterOptions(rateLimiterInterval)
        .getInterval()
        .isEqual(rateLimiterInterval),
    ).toBe(true);
    expect(
      new SchedulerOptions(schedulerInterval, () => undefined)
        .getInterval()
        .isEqual(schedulerInterval),
    ).toBe(true);
    expect(() => new Debouncer(debounceDelay)).not.toThrow();
    expect(() => new Throttler(throttleInterval)).not.toThrow();
    expect(debounceDelay.isEqual(Duration.fromMilliseconds(10))).toBe(true);
  });

  it('uses semaphore capacity as a value object', () => {
    const capacity = new SemaphoreCapacity(1);
    const semaphore = new Semaphore(capacity);

    expect(semaphore.getCapacity()).toBe(1);
    expect(new SemaphorePermits(1).releaseOne(capacity).valueOf()).toBe(1);
  });

  it('rejects negative flow counts', () => {
    expect(() => new ActiveTaskCount(-1)).toThrow(InvalidFlowCountError);
  });

  it('uses explicit circuit breaker count value objects', () => {
    expect(
      new CircuitBreakerFailureCount(2).hasReached(
        new CircuitBreakerFailureThreshold(2),
      ),
    ).toBe(true);
    expect(CircuitBreakerProbeCount.ZERO.decrement().isZero()).toBe(true);
  });

  it('knows that a closed circuit breaker has no recovery timestamp', () => {
    expect(
      CircuitBreakerOpenedAt.closed().hasRecoveryElapsed(
        Duration.fromMilliseconds(1),
        Timestamp.now(),
      ),
    ).toBe(false);
  });

  it('models empty debounce tasks explicitly', async () => {
    const task = PendingDebounceTask.fromTask(() => 'value');

    expect(task.isEmpty()).toBe(false);
    await expect(task.run()).resolves.toBe('value');
    await expect(PendingDebounceTask.empty().run()).rejects.toThrow(
      FlowCancelledError,
    );
  });

  it('waits through timer delay reservations', async () => {
    const reservation = NextRunAt.immediate().reserve(
      Timestamp.now(),
      Duration.fromMilliseconds(1),
    );

    await expect(reservation.waitForDelay()).resolves.toBeUndefined();
    expect(reservation.getDelay()).toBeInstanceOf(TimerDelay);
    expect(
      reservation.getDelay().getDuration().isEqual(Duration.fromMilliseconds(0)),
    ).toBe(true);
  });

  it('normalizes invalid positive durations', () => {
    expect(() => new RateLimiterInterval(Number.NaN)).toThrow(
      InvalidPositiveDurationValueError,
    );
  });

  it('normalizes invalid non-negative durations', () => {
    expect(() => new RetryDelay(-1)).toThrow(
      InvalidNonNegativeDurationValueError,
    );
  });

  it('normalizes invalid positive integers', () => {
    expect(() => new Concurrency(Number.NaN)).toThrow(
      InvalidPositiveIntegerValueError,
    );
  });
});
