import { Duration } from '@haskou/value-objects';

import {
  CircuitBreakerOptions,
  Debouncer,
  RateLimiter,
  RateLimiterOptions,
  SchedulerOptions,
  Throttler,
} from '../../src';

describe('Duration input', () => {
  it('can configure rate limiter intervals', async () => {
    const rateLimiter = new RateLimiter(
      new RateLimiterOptions(Duration.fromMilliseconds(1)),
    );

    await expect(rateLimiter.run(() => 'value')).resolves.toBe('value');
  });

  it('can configure scheduler intervals', () => {
    const options = new SchedulerOptions(
      Duration.fromMilliseconds(1),
      () => undefined,
    );

    expect(options.getInterval().isEqual(Duration.fromMilliseconds(1))).toBe(
      true,
    );
  });

  it('can configure debounce delays', async () => {
    const debouncer = new Debouncer<string>(Duration.fromMilliseconds(1));

    await expect(debouncer.run(() => 'value')).resolves.toBe('value');
  });

  it('can configure throttle intervals', async () => {
    const throttler = new Throttler(Duration.fromMilliseconds(1));

    await expect(throttler.run(() => 'value')).resolves.toBe('value');
  });

  it('can configure circuit breaker recovery timeout', () => {
    const options = new CircuitBreakerOptions(
      1,
      Duration.fromMilliseconds(1),
    );

    expect(
      options.getRecoveryTimeout().isEqual(Duration.fromMilliseconds(1)),
    ).toBe(true);
  });
});
