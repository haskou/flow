import {
  CircuitBreaker,
  CircuitBreakerOptions,
  FlowPipeline,
  Queue,
  QueueOptions,
  RateLimiter,
  RateLimiterOptions,
  Scheduler,
  SchedulerOptions,
  Semaphore,
} from '../../src';

describe(FlowPipeline.name, () => {
  it('runs a task through controllers in registration order', async () => {
    const calls: string[] = [];
    const queue = new Queue(QueueOptions.withConcurrency(1));
    const rateLimiter = new RateLimiter(new RateLimiterOptions(1));
    const circuitBreaker = new CircuitBreaker(new CircuitBreakerOptions(1, 1));
    const semaphore = new Semaphore(1);

    const pipeline = new FlowPipeline()
      .through(queue)
      .through(rateLimiter)
      .through(circuitBreaker)
      .through(semaphore);

    const result = await pipeline.run(() => {
      calls.push('task');

      return 'value';
    });

    await queue.waitUntilIdle();
    await rateLimiter.waitUntilIdle();

    expect(result).toBe('value');
    expect(calls).toEqual(['task']);
  });

  it('can be used as a scheduler task', async () => {
    const calls: string[] = [];
    const pipeline = new FlowPipeline()
      .through(new Queue())
      .through(new CircuitBreaker(new CircuitBreakerOptions(1, 1)));
    const scheduler = new Scheduler(
      new SchedulerOptions(1, () =>
        pipeline.run(() => {
          calls.push('scheduled');
        }),
      ),
    );

    await expect(scheduler.runOnce()).resolves.toBe(true);

    expect(calls).toEqual(['scheduled']);
  });

  it('propagates controller failures', async () => {
    const circuitBreaker = new CircuitBreaker(
      new CircuitBreakerOptions(1, 1000),
    );
    const pipeline = new FlowPipeline().through(circuitBreaker);

    await expect(
      pipeline.run(() => {
        throw new Error('provider failed');
      }),
    ).rejects.toThrow('provider failed');

    await expect(pipeline.run(() => 'blocked')).rejects.toThrow(
      'Circuit breaker is open',
    );
  });

  it('runs directly when no controllers are registered', async () => {
    const pipeline = new FlowPipeline();

    await expect(pipeline.run(() => 'direct')).resolves.toBe('direct');
  });
});
