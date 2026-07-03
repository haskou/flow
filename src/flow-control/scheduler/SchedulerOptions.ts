import { Duration } from '@haskou/value-objects';

import { InvalidSchedulerIntervalError } from '../../errors/InvalidSchedulerIntervalError';
import { Semaphore } from '../semaphore/Semaphore';
import { SchedulerInterval } from '../value-objects/SchedulerInterval';
import { SchedulerErrorPolicy } from './SchedulerErrorPolicy';

export class SchedulerOptions {
  private readonly errorPolicy: SchedulerErrorPolicy;
  private readonly interval: SchedulerInterval;
  private readonly semaphore: Semaphore;
  private readonly task: () => Promise<void> | void;

  public constructor(
    interval: number | Duration | SchedulerInterval,
    task: () => Promise<void> | void,
    errorPolicy: SchedulerErrorPolicy = SchedulerErrorPolicy.THROW,
    semaphore: Semaphore = new Semaphore(1),
  ) {
    try {
      this.interval =
        interval instanceof SchedulerInterval
          ? interval
          : new SchedulerInterval(interval);
    } catch {
      throw new InvalidSchedulerIntervalError();
    }
    this.task = task;
    this.errorPolicy = errorPolicy;
    this.semaphore = semaphore;
  }

  public getErrorPolicy(): SchedulerErrorPolicy {
    return this.errorPolicy;
  }

  public getInterval(): SchedulerInterval {
    return this.interval;
  }

  public getSemaphore(): Semaphore {
    return this.semaphore;
  }

  public getTask(): () => Promise<void> | void {
    return this.task;
  }
}
