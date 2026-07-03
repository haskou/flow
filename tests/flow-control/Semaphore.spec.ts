import {
  FlowAbortedError,
  InvalidSemaphorePermitsError,
  Semaphore,
  SemaphoreCapacity,
  SemaphorePermit,
  SemaphoreReleasedError,
  SemaphoreWaiter,
} from '../../src';

describe(Semaphore.name, () => {
  it('limits concurrent work', async () => {
    const semaphore = new Semaphore(1);
    const order: string[] = [];

    const first = semaphore.runExclusive(async () => {
      order.push('first:start');
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });
      order.push('first:end');
    });

    const second = semaphore.runExclusive(() => {
      order.push('second');
    });

    await Promise.all([first, second]);

    expect(order).toEqual(['first:start', 'first:end', 'second']);
  });

  it('accepts a semaphore capacity value object', () => {
    const semaphore = new Semaphore(new SemaphoreCapacity(2));

    expect(semaphore.getCapacity()).toBe(2);
  });

  it('rejects invalid permit counts', () => {
    expect(() => new Semaphore(0)).toThrow(InvalidSemaphorePermitsError);
  });

  it('runs tasks through the run alias', async () => {
    const semaphore = new Semaphore(1);

    await expect(semaphore.run(() => 'value')).resolves.toBe('value');
  });

  it('rejects double permit release', async () => {
    const permit = await new Semaphore(1).acquire();

    permit.release();

    expect(() => {
      permit.release();
    }).toThrow(SemaphoreReleasedError);
  });

  it('queues acquirers when no permit is available', async () => {
    const semaphore = new Semaphore(1);
    const firstPermit = await semaphore.acquire();
    const secondPermitPromise = semaphore.acquire();

    expect(semaphore.getCapacity()).toBe(1);
    expect(semaphore.getAvailablePermits()).toBe(0);
    expect(semaphore.getWaitingCount()).toBe(1);

    firstPermit.release();
    const secondPermit = await secondPermitPromise;

    expect(semaphore.getWaitingCount()).toBe(0);

    secondPermit.release();

    expect(semaphore.getAvailablePermits()).toBe(1);
  });

  it('can abort a queued acquire', async () => {
    const semaphore = new Semaphore(1);
    const permit = await semaphore.acquire();
    const controller = new AbortController();
    const queued = semaphore.acquire(controller.signal);

    expect(semaphore.getWaitingCount()).toBe(1);

    controller.abort();

    await expect(queued).rejects.toThrow(FlowAbortedError);
    expect(semaphore.getWaitingCount()).toBe(0);

    permit.release();
  });

  it('rejects acquire when the signal is already aborted', async () => {
    const semaphore = new Semaphore(1);
    const permit = await semaphore.acquire();
    const controller = new AbortController();

    controller.abort();

    await expect(semaphore.acquire(controller.signal)).rejects.toThrow(
      FlowAbortedError,
    );

    permit.release();
  });

  it('can grant a waiter that is not watching an abort signal', () => {
    const permit = new SemaphorePermit(() => undefined);
    const resolve = jest.fn();
    const waiter = new SemaphoreWaiter(resolve, jest.fn());

    waiter.grant(permit);

    expect(resolve).toHaveBeenCalledWith(permit);
  });
});
