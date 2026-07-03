import { Debouncer } from '../../src';

describe(Debouncer.name, () => {
  it('runs only the latest task and resolves all callers with its result', async () => {
    const debouncer = new Debouncer<string>(5);
    const first = debouncer.run(() => 'first');
    const second = debouncer.run(() => 'second');

    await expect(Promise.all([first, second])).resolves.toEqual([
      'second',
      'second',
    ]);
  });

  it('rejects callers when the latest task fails', async () => {
    const debouncer = new Debouncer<string>(5);

    await expect(
      debouncer.run(() => {
        throw new Error('debounced failure');
      }),
    ).rejects.toThrow('debounced failure');
  });

  it('cancels pending callers', async () => {
    const debouncer = new Debouncer<string>(50);
    const pending = debouncer.run(() => 'value');

    debouncer.cancel();

    await expect(pending).rejects.toThrow('Flow operation was cancelled');
  });

  it('supports cancelling when no timer is active', () => {
    const debouncer = new Debouncer<string>(50);

    expect(() => {
      debouncer.cancel(new Error('manual'));
    }).not.toThrow();
  });
});
