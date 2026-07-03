import { Concurrency, Queue, QueueClearedError, QueueOptions } from '../../src';

describe(Queue.name, () => {
  it('runs tasks with configured concurrency', async () => {
    const queue = new Queue(QueueOptions.withConcurrency(2));
    let activeCount = 0;
    let maxActiveCount = 0;

    const results = await Promise.all(
      [1, 2, 3].map((value) =>
        queue.enqueue(async () => {
          activeCount += 1;
          maxActiveCount = Math.max(maxActiveCount, activeCount);
          await new Promise((resolve) => {
            setTimeout(resolve, 10);
          });
          activeCount -= 1;

          return value;
        }),
      ),
    );

    expect(results).toEqual([1, 2, 3]);
    expect(maxActiveCount).toBe(2);
    expect(queue.getConcurrency().isEqual(new Concurrency(2))).toBe(true);
  });

  it('can clear pending work', async () => {
    const queue = new Queue(QueueOptions.withConcurrency(1));

    const first = queue.enqueue(
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, 20);
        }),
    );
    const second = queue.enqueue(() => 'second');
    const secondExpectation = expect(second).rejects.toThrow(QueueClearedError);

    queue.clear();

    await first;
    await secondExpectation;
  });

  it('waits until queued work is idle', async () => {
    const queue = new Queue(QueueOptions.withConcurrency(1));
    const completed: string[] = [];

    const first = queue.enqueue(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 5);
      });
      completed.push('first');
    });
    const second = queue.enqueue(() => {
      completed.push('second');
    });

    await queue.waitUntilIdle();
    await Promise.all([first, second]);

    expect(completed).toEqual(['first', 'second']);
    expect(queue.getActiveCount()).toBe(0);
    expect(queue.getPendingCount()).toBe(0);
  });

  it('propagates task failures', async () => {
    const queue = new Queue();

    await expect(
      queue.enqueue(() => {
        throw new Error('queue failure');
      }),
    ).rejects.toThrow('queue failure');
  });

  it('resolves immediately when already idle', async () => {
    const queue = new Queue();

    await expect(queue.waitUntilIdle()).resolves.toBeUndefined();
  });
});
