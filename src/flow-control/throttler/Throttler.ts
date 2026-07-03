import { Duration, Timestamp } from '@haskou/value-objects';

import { InvalidThrottlerIntervalError } from '../../errors/InvalidThrottlerIntervalError';
import { Queue } from '../queue/Queue';
import { QueueOptions } from '../queue/QueueOptions';
import { NextRunAt } from '../value-objects/NextRunAt';
import { ThrottleInterval } from '../value-objects/ThrottleInterval';

export class Throttler {
  private readonly interval: ThrottleInterval;
  private readonly queue = new Queue(QueueOptions.withConcurrency(1));
  private nextRunAt = NextRunAt.immediate();

  public constructor(interval: number | Duration | ThrottleInterval) {
    try {
      this.interval =
        interval instanceof ThrottleInterval
          ? interval
          : new ThrottleInterval(interval);
    } catch {
      throw new InvalidThrottlerIntervalError();
    }
  }

  private waitForTurn(): Promise<void> {
    const reservation = this.nextRunAt.reserve(Timestamp.now(), this.interval);
    this.nextRunAt = reservation.getNextRunAt();

    return reservation.waitForDelay();
  }

  public run<T>(task: () => Promise<T> | T): Promise<T> {
    return this.queue.enqueue(async () => {
      await this.waitForTurn();

      return task();
    });
  }

  public waitUntilIdle(): Promise<void> {
    return this.queue.waitUntilIdle();
  }
}
