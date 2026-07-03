import { Throttler } from '../../src';

describe(Throttler.name, () => {
  it('throttles queued task starts and waits until idle', async () => {
    const throttler = new Throttler(5);
    const calls: string[] = [];

    const first = throttler.run(() => {
      calls.push('first');

      return 'first';
    });
    const second = throttler.run(() => {
      calls.push('second');

      return 'second';
    });

    await expect(Promise.all([first, second])).resolves.toEqual([
      'first',
      'second',
    ]);
    await throttler.waitUntilIdle();

    expect(calls).toEqual(['first', 'second']);
  });
});
