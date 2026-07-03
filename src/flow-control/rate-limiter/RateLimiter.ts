import { Timestamp } from '@haskou/value-objects';

import { Queue } from '../queue/Queue';
import { NextRunAt } from '../value-objects/NextRunAt';
import { RateLimiterInterval } from '../value-objects/RateLimiterInterval';
import { RateLimiterOptions } from './RateLimiterOptions';

export class RateLimiter {
  private readonly interval: RateLimiterInterval;
  private readonly queue: Queue;
  private nextRunAt = NextRunAt.immediate();

  public constructor(options: RateLimiterOptions) {
    this.interval = options.getInterval();
    this.queue = new Queue(options.getQueueOptions());
  }

  private waitForTurn(): Promise<void> {
    const reservation = this.nextRunAt.reserve(Timestamp.now(), this.interval);
    this.nextRunAt = reservation.getNextRunAt();

    return reservation.waitForDelay();
  }

  public schedule<T>(task: () => Promise<T> | T): Promise<T> {
    return this.queue.enqueue(async () => {
      await this.waitForTurn();

      return task();
    });
  }

  public run<T>(task: () => Promise<T> | T): Promise<T> {
    return this.schedule(task);
  }

  public waitUntilIdle(): Promise<void> {
    return this.queue.waitUntilIdle();
  }
}
