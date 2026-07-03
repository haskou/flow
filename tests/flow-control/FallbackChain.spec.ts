import { FallbackChain, FallbackChainExhaustedError } from '../../src';

describe(FallbackChain.name, () => {
  it('returns the first available value', async () => {
    const fallbackChain = new FallbackChain<string>();

    const value = await fallbackChain
      .try(() => 'memory')
      .try(() => 'database')
      .run();

    expect(value).toBe('memory');
  });

  it('tries the next attempt after null, undefined, or thrown failures', async () => {
    const fallbackChain = new FallbackChain<string>();

    const value = await fallbackChain
      .try(() => null)
      .try(() => undefined)
      .try(() => {
        throw new Error('redis unavailable');
      })
      .try(async () => 'database')
      .run();

    expect(value).toBe('database');
  });

  it('treats falsy values as unavailable', async () => {
    const fallbackChain = new FallbackChain<string | number | false>();

    const value = await fallbackChain
      .try(() => 0)
      .try(() => false)
      .try(() => '')
      .try(() => 'remote')
      .run();

    expect(value).toBe('remote');
  });

  it('throws when every attempt fails', async () => {
    const fallbackChain = new FallbackChain<string>();

    await expect(
      fallbackChain
        .try(() => null)
        .try(() => {
          throw new Error('remote unavailable');
        })
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
