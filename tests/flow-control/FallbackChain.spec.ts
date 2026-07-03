import {
  FallbackChain,
  FallbackChainExhaustedError,
  FallbackChainOptions,
} from '../../src';

describe(FallbackChain.name, () => {
  it('returns the first available value', async () => {
    const fallbackChain = new FallbackChain<string>();

    const value = await fallbackChain
      .try(() => 'memory')
      .try(() => 'database')
      .run();

    expect(value).toBe('memory');
  });

  it('tries the next attempt after null or undefined', async () => {
    const fallbackChain = new FallbackChain<string>();

    const value = await fallbackChain
      .try(() => null)
      .try(() => undefined)
      .try(async () => 'database')
      .run();

    expect(value).toBe('database');
  });

  it('treats falsy values as resolved values', async () => {
    const fallbackChain = new FallbackChain<string | number | false>();

    const value = await fallbackChain
      .try(() => 0)
      .try(() => false)
      .try(() => '')
      .try(() => 'remote')
      .run();

    expect(value).toBe(0);
  });

  it('propagates attempt errors by default', async () => {
    const fallbackChain = new FallbackChain<string>();

    await expect(
      fallbackChain
        .try(() => {
          throw new Error('redis unavailable');
        })
        .try(() => 'database')
        .run(),
    ).rejects.toThrow('redis unavailable');
  });

  it('can catch errors explicitly and notify handlers', async () => {
    const errors: unknown[] = [];
    const fallbackChain = new FallbackChain<string>(
      FallbackChainOptions.catchingErrors(),
    ).onError((error) => {
      errors.push(error);
    });

    const value = await fallbackChain
      .try(() => {
        throw new Error('redis unavailable');
      })
      .try(() => 'database')
      .run();

    expect(value).toBe('database');
    expect(errors).toHaveLength(1);
  });

  it('accepts explicit options with the default resolver', async () => {
    const fallbackChain = new FallbackChain<number>(
      new FallbackChainOptions<number>(),
    );

    await expect(fallbackChain.try(() => 0).run()).resolves.toBe(0);
  });

  it('throws when every attempt fails', async () => {
    const fallbackChain = new FallbackChain<string>();

    await expect(
      fallbackChain
        .try(() => null)
        .try(() => undefined)
        .run(),
    ).rejects.toThrow(FallbackChainExhaustedError);
  });

  it('throws when the chain is empty', async () => {
    const fallbackChain = new FallbackChain<string>();

    await expect(fallbackChain.run()).rejects.toThrow(
      FallbackChainExhaustedError,
    );
  });
});
