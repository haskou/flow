import { Semaphore, SemaphoreReleasedError } from '../../src';

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
});
