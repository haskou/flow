import {
  InvalidRetryAttemptsError,
  InvalidRetryDelayError,
  Retrier,
  RetryAttempts,
  RetryDelay,
  RetryOptions,
} from '../../src';

describe(Retrier.name, () => {
  it('retries until a task succeeds', async () => {
    const retrier = new Retrier(new RetryOptions(3));
    let calls = 0;

    await expect(
      retrier.run(() => {
        calls += 1;

        if (calls < 2) {
          throw new Error('temporary');
        }

        return 'ok';
      }),
    ).resolves.toBe('ok');

    expect(calls).toBe(2);
  });

  it('throws the last task error when attempts are exhausted', async () => {
    const retrier = new Retrier(new RetryOptions(2));

    await expect(
      retrier.run(() => {
        throw new Error('final');
      }),
    ).rejects.toThrow('final');
  });

  it('can wait between attempts', async () => {
    const retrier = new Retrier(new RetryOptions(2, 1));
    let calls = 0;

    await expect(
      retrier.run(() => {
        calls += 1;

        if (calls === 1) {
          throw new Error('wait');
        }

        return 'waited';
      }),
    ).resolves.toBe('waited');
  });

  it('uses default options', async () => {
    const retrier = new Retrier();

    await expect(retrier.run(() => 'default')).resolves.toBe('default');
  });

  it('accepts retry value objects as options', () => {
    const attempts = new RetryAttempts(2);
    const delay = RetryDelay.none();
    const options = new RetryOptions(attempts, delay);

    expect(options.getAttempts()).toBe(attempts);
    expect(options.getDelay()).toBe(delay);
  });

  it('rejects invalid options', () => {
    expect(() => new RetryOptions(0)).toThrow(InvalidRetryAttemptsError);
    expect(() => new RetryOptions(1, Number.NaN)).toThrow(
      InvalidRetryDelayError,
    );
  });
});
