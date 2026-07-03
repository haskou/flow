import { SchedulerAlreadyRunningError } from '../../errors/SchedulerAlreadyRunningError';
import { Semaphore } from '../semaphore/Semaphore';
import { SchedulerInterval } from '../value-objects/SchedulerInterval';
import { SchedulerErrorPolicy } from './SchedulerErrorPolicy';
import { SchedulerOptions } from './SchedulerOptions';

export class Scheduler {
  private readonly errorPolicy: SchedulerErrorPolicy;
  private readonly interval: SchedulerInterval;
  private readonly semaphore: Semaphore;
  private readonly task: () => Promise<void> | void;
  private timer: NodeJS.Timeout | null = null;

  public constructor(options: SchedulerOptions) {
    this.interval = options.getInterval();
    this.task = options.getTask();
    this.errorPolicy = options.getErrorPolicy();
    this.semaphore = options.getSemaphore();
  }

  private shouldThrowErrors(): boolean {
    return this.errorPolicy.isThrow();
  }

  public start(): void {
    if (this.timer) {
      return;
    }

    this.timer = this.interval.toTimerDelay().setInterval(() => {
      void this.runOnce();
    });
  }

  public stop(): void {
    if (!this.timer) {
      return;
    }

    clearInterval(this.timer);
    this.timer = null;
  }

  public isRunning(): boolean {
    return Boolean(this.timer);
  }

  public async runOnce(): Promise<boolean> {
    const permit = this.semaphore.tryAcquire();

    if (!permit) {
      return false;
    }

    try {
      await this.task();

      return true;
    } catch (error) {
      if (this.shouldThrowErrors()) {
        throw error;
      }

      return true;
    } finally {
      permit.release();
    }
  }

  public assertStopped(): void {
    if (this.isRunning()) {
      throw new SchedulerAlreadyRunningError();
    }
  }
}
