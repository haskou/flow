import {
  CircuitBreakerOptions,
  Debouncer,
  QueueOptions,
  RateLimiterOptions,
  SchedulerOptions,
  Semaphore,
  Throttler,
} from '../../src';

describe('flow-control validation', () => {
  it('rejects invalid semaphore permits', () => {
    expect(() => new Semaphore(0)).toThrow(
      'Semaphore permits must be a positive integer',
    );
  });

  it('rejects invalid queue concurrency', () => {
    expect(() => QueueOptions.withConcurrency(0)).toThrow(
      'Queue concurrency must be a positive integer',
    );
  });

  it('rejects invalid rate limiter intervals', () => {
    expect(() => new RateLimiterOptions(0)).toThrow(
      'Rate limiter interval must be a positive integer',
    );
  });

  it('rejects invalid scheduler intervals', () => {
    expect(() => new SchedulerOptions(0, () => undefined)).toThrow(
      'Scheduler interval must be a positive integer',
    );
  });

  it('rejects invalid debouncer delays', () => {
    expect(() => new Debouncer(0)).toThrow(
      'Debouncer delay must be a positive integer',
    );
  });

  it('rejects invalid throttler intervals', () => {
    expect(() => new Throttler(0)).toThrow(
      'Throttler interval must be a positive integer',
    );
  });

  it('rejects invalid circuit breaker options', () => {
    expect(() => new CircuitBreakerOptions(0, 1)).toThrow(
      'Circuit breaker failure threshold must be a positive integer',
    );
    expect(() => new CircuitBreakerOptions(1, 0)).toThrow(
      'Circuit breaker recovery timeout must be a positive integer',
    );
    expect(() => new CircuitBreakerOptions(1, 1, 0)).toThrow(
      'Circuit breaker success threshold must be a positive integer',
    );
    expect(() => new CircuitBreakerOptions(1, 1, 1, 0)).toThrow(
      'Circuit breaker half-open max concurrent must be a positive integer',
    );
  });
});
