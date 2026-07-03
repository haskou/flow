import {
  Scheduler,
  SchedulerAlreadyRunningError,
  SchedulerErrorPolicy,
  SchedulerOptions,
} from '../../src';

describe(Scheduler.name, () => {
  it('skips overlapping runs', async () => {
    let resolveTask = (): void => undefined;
    let runCount = 0;
    const scheduler = new Scheduler(
      new SchedulerOptions(10, async () => {
        runCount += 1;
        await new Promise<void>((resolve) => {
          resolveTask = resolve;
        });
      }),
    );

    const first = scheduler.runOnce();
    const second = scheduler.runOnce();

    await expect(second).resolves.toBe(false);

    resolveTask();

    await expect(first).resolves.toBe(true);
    expect(runCount).toBe(1);
  });

  it('starts, avoids duplicate starts, stops, and asserts stopped state', () => {
    const scheduler = new Scheduler(new SchedulerOptions(10, () => undefined));

    expect(scheduler.isRunning()).toBe(false);
    scheduler.start();
    scheduler.start();

    expect(scheduler.isRunning()).toBe(true);
    expect(() => {
      scheduler.assertStopped();
    }).toThrow(SchedulerAlreadyRunningError);

    scheduler.stop();
    scheduler.stop();

    expect(scheduler.isRunning()).toBe(false);
    expect(() => {
      scheduler.assertStopped();
    }).not.toThrow();
  });

  it('runs scheduled ticks after start', async () => {
    let runCount = 0;
    const scheduler = new Scheduler(
      new SchedulerOptions(5, () => {
        runCount += 1;
      }),
    );

    scheduler.start();
    await new Promise((resolve) => {
      setTimeout(resolve, 8);
    });
    scheduler.stop();

    expect(runCount).toBeGreaterThanOrEqual(1);
  });

  it('throws task failures by default', async () => {
    const scheduler = new Scheduler(
      new SchedulerOptions(10, () => {
        throw new Error('scheduler failure');
      }),
    );

    await expect(scheduler.runOnce()).rejects.toThrow('scheduler failure');
  });

  it('can swallow task failures', async () => {
    const scheduler = new Scheduler(
      new SchedulerOptions(
        10,
        () => {
          throw new Error('scheduler failure');
        },
        SchedulerErrorPolicy.SWALLOW,
      ),
    );

    await expect(scheduler.runOnce()).resolves.toBe(true);
    expect(SchedulerErrorPolicy.fromPrimitives('swallow').isSwallow()).toBe(
      true,
    );
  });
});
