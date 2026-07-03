import {
  InvalidTimeoutDurationError,
  Timeout,
  TimeoutDuration,
  TimeoutError,
} from '../../src';

describe(Timeout.name, () => {
  it('resolves when the task finishes before the timeout', async () => {
    const timeout = new Timeout(new TimeoutDuration(50));

    await expect(timeout.run(() => 'value')).resolves.toBe('value');
  });

  it('rejects and aborts when the timeout elapses', async () => {
    const timeout = new Timeout(1);
    let aborted = false;

    await expect(
      timeout.run(
        (signal) =>
          new Promise((resolve) => {
            signal.addEventListener('abort', () => {
              aborted = true;
            });
            setTimeout(resolve, 20);
          }),
      ),
    ).rejects.toThrow(TimeoutError);

    expect(aborted).toBe(true);
  });

  it('passes parent aborts to the running task', async () => {
    const timeout = new Timeout(50);
    const controller = new AbortController();
    const promise = timeout.run(
      (signal) =>
        new Promise((_, reject) => {
          signal.addEventListener('abort', () => {
            reject(new Error('parent aborted'));
          });
        }),
      controller.signal,
    );

    controller.abort();

    await expect(promise).rejects.toThrow('parent aborted');
  });

  it('rejects invalid durations', () => {
    expect(() => new Timeout(0)).toThrow(InvalidTimeoutDurationError);
  });
});
