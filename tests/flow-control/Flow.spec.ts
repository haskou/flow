import {
  Abortable,
  CircuitBreaker,
  CircuitBreakerOptions,
  Flow,
  FlowTaskMissingError,
  Queue,
  QueueOptions,
  Racer,
  RateLimiter,
  RateLimiterOptions,
  Semaphore,
  Throttler,
  TimeoutError,
  RetryOptions,
} from '../../src';

describe(Flow.name, () => {
  it('runs a task through timeout, retry, and semaphore limit', async () => {
    const semaphore = new Semaphore(1);
    let calls = 0;

    const result = await new Flow()
      .task(() => {
        calls += 1;

        if (calls === 1) {
          throw new Error('temporary');
        }

        return 'value';
      })
      .timeout(50)
      .retry({ attempts: 2 })
      .limit(semaphore)
      .run();

    expect(result).toBe('value');
    expect(calls).toBe(2);
  });

  it('runs racers with retries', async () => {
    let calls = 0;
    const racer = new Racer<string>().task(() => {
      calls += 1;

      if (calls === 1) {
        throw new Error('first race failed');
      }

      return 'winner';
    });

    await expect(
      new Flow().race(racer).retry(new RetryOptions(2)).run(),
    ).resolves.toBe('winner');
  });

  it('can compose existing run controllers', async () => {
    const queue = new Queue(QueueOptions.withConcurrency(1));
    const limiter = new RateLimiter(new RateLimiterOptions(1));
    const circuitBreaker = new CircuitBreaker(new CircuitBreakerOptions(1, 10));

    await expect(
      new Flow()
        .task(() => 'composed')
        .queue(queue)
        .rateLimit(limiter)
        .circuitBreaker(circuitBreaker)
        .run(),
    ).resolves.toBe('composed');
  });

  it('can compose throttlers', async () => {
    await expect(
      new Flow()
        .task(() => 'throttled')
        .throttle(new Throttler(1))
        .run(),
    ).resolves.toBe('throttled');
  });

  it('supports custom flow controllers through through()', async () => {
    const result = await new Flow()
      .task(() => 'custom')
      .through({
        run: (task, signal) => task.run(signal),
      })
      .run();

    expect(result).toBe('custom');
  });

  it('rejects when no task is configured', async () => {
    await expect(new Flow().run()).rejects.toThrow(FlowTaskMissingError);
  });

  it('can be aborted externally', async () => {
    const abortable = new Abortable();
    const flow = new Flow()
      .task(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 20);
          }),
      )
      .abortable(abortable);
    const promise = flow.run();

    abortable.abort();

    await expect(promise).rejects.toThrow('Flow execution was aborted');
  });

  it('rejects on timeout', async () => {
    await expect(
      new Flow()
        .task(
          () =>
            new Promise((resolve) => {
              setTimeout(resolve, 20);
            }),
        )
        .timeout(1)
        .run(),
    ).rejects.toThrow(TimeoutError);
  });
});
