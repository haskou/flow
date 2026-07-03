import {
  QueueOptions,
  RateLimiter,
  RateLimiterOptions,
} from '../../src';

describe(RateLimiter.name, () => {
  it('schedules tasks and waits until idle', async () => {
    const rateLimiter = new RateLimiter(
      new RateLimiterOptions(5, QueueOptions.withConcurrency(1)),
    );
    const calls: string[] = [];

    const first = rateLimiter.schedule(() => {
      calls.push('first');

      return 'first';
    });
    const second = rateLimiter.schedule(() => {
      calls.push('second');

      return 'second';
    });

    await expect(Promise.all([first, second])).resolves.toEqual([
      'first',
      'second',
    ]);
    await rateLimiter.waitUntilIdle();

    expect(calls).toEqual(['first', 'second']);
  });

  it('uses default queue options', async () => {
    const rateLimiter = new RateLimiter(new RateLimiterOptions(1));

    await expect(rateLimiter.schedule(() => 'value')).resolves.toBe('value');
  });
});
