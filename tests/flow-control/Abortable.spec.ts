import { Abortable, FlowAbortedError } from '../../src';

describe(Abortable.name, () => {
  it('runs a task with an abort signal', async () => {
    const abortable = new Abortable();

    await expect(abortable.run((signal) => signal.aborted)).resolves.toBe(
      false,
    );
    expect(abortable.getSignal().aborted).toBe(false);
  });

  it('rejects pending work when aborted', async () => {
    const abortable = new Abortable();
    const promise = abortable.run(
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, 20);
        }),
    );

    abortable.abort();

    await expect(promise).rejects.toThrow(FlowAbortedError);
    await expect(abortable.run(() => 'late')).rejects.toThrow(FlowAbortedError);
  });
});
