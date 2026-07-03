import { Duration } from '@haskou/value-objects';

import { InvalidRateLimiterIntervalError } from '../../errors/InvalidRateLimiterIntervalError';
import { QueueOptions } from '../queue/QueueOptions';
import { RateLimiterInterval } from '../value-objects/RateLimiterInterval';

export class RateLimiterOptions {
  private readonly interval: RateLimiterInterval;
  private readonly queueOptions: QueueOptions;

  public constructor(
    interval: number | Duration | RateLimiterInterval,
    queueOptions: QueueOptions = new QueueOptions(),
  ) {
    try {
      this.interval =
        interval instanceof RateLimiterInterval
          ? interval
          : new RateLimiterInterval(interval);
    } catch {
      throw new InvalidRateLimiterIntervalError();
    }
    this.queueOptions = queueOptions;
  }

  public getInterval(): RateLimiterInterval {
    return this.interval;
  }

  public getQueueOptions(): QueueOptions {
    return this.queueOptions;
  }
}
