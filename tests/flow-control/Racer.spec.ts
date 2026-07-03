import { Racer, RacerExhaustedError, Retrier, RetryOptions } from '../../src';

describe(Racer.name, () => {
  it('resolves with the first successful candidate', async () => {
    const racer = new Racer<string>()
      .task(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve('slow'), 20);
          }),
      )
      .task(() => 'fast');

    await expect(racer.run()).resolves.toBe('fast');
  });

  it('fails when every candidate fails', async () => {
    const racer = new Racer<string>()
      .task(() => {
        throw new Error('first');
      })
      .add(() => {
        throw new Error('second');
      });

    await expect(racer.run()).rejects.toThrow(RacerExhaustedError);
  });

  it('fails when no candidates are registered', async () => {
    await expect(new Racer().run()).rejects.toThrow(RacerExhaustedError);
  });

  it('passes external aborts to candidates', async () => {
    const controller = new AbortController();
    const racer = new Racer<string>().task(
      (signal) =>
        new Promise((_, reject) => {
          signal.addEventListener('abort', () => {
            reject(new Error('aborted candidate'));
          });
        }),
    );
    const promise = racer.run(controller.signal);

    controller.abort();

    await expect(promise).rejects.toThrow(RacerExhaustedError);
  });

  it('can be retried as a task', async () => {
    let calls = 0;
    const retrier = new Retrier(new RetryOptions(2));
    const racer = new Racer<string>().task(() => {
      calls += 1;

      if (calls === 1) {
        throw new Error('temporary');
      }

      return 'retried';
    });

    await expect(retrier.run((signal) => racer.run(signal))).resolves.toBe(
      'retried',
    );
  });
});
