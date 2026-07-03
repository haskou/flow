import { Duration } from '@haskou/value-objects';

import { FlowCancelledError } from '../../errors/FlowCancelledError';
import { InvalidDebouncerDelayError } from '../../errors/InvalidDebouncerDelayError';
import { DebounceDelay } from '../value-objects/DebounceDelay';
import { PendingDebounceTask } from './PendingDebounceTask';

export class Debouncer<T> {
  private readonly delay: DebounceDelay;
  private latestTask = PendingDebounceTask.empty<T>();
  private readonly pendingResolvers: Array<(value: T) => void> = [];
  private readonly pendingRejecters: Array<(error: unknown) => void> = [];
  private timer: NodeJS.Timeout | null = null;

  public constructor(delay: number | Duration | DebounceDelay) {
    try {
      this.delay =
        delay instanceof DebounceDelay ? delay : new DebounceDelay(delay);
    } catch {
      throw new InvalidDebouncerDelayError();
    }
  }

  private resetTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = this.delay.toTimerDelay().setTimeout(() => {
      void this.flush();
    });
  }

  private async flush(): Promise<void> {
    const task = this.latestTask;
    const resolvers = this.pendingResolvers.splice(0);
    const rejecters = this.pendingRejecters.splice(0);
    this.latestTask = PendingDebounceTask.empty<T>();
    this.timer = null;

    try {
      const value = await task.run();

      for (const resolve of resolvers) {
        resolve(value);
      }
    } catch (error) {
      for (const reject of rejecters) {
        reject(error);
      }
    }
  }

  public run(task: () => Promise<T> | T): Promise<T> {
    this.latestTask = PendingDebounceTask.fromTask(task);

    const promise = new Promise<T>((resolve, reject) => {
      this.pendingResolvers.push(resolve);
      this.pendingRejecters.push(reject);
    });

    this.resetTimer();

    return promise;
  }

  public cancel(error: Error = new FlowCancelledError()): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.latestTask = PendingDebounceTask.empty<T>();

    const rejecters = this.pendingRejecters.splice(0);
    this.pendingResolvers.splice(0);

    for (const reject of rejecters) {
      reject(error);
    }
  }
}
