import { QueueClearedError } from '../../errors/QueueClearedError';
import { ActiveTaskCount } from '../value-objects/ActiveTaskCount';
import { Concurrency } from '../value-objects/Concurrency';
import { QueuedTask } from './QueuedTask';
import { QueueOptions } from './QueueOptions';

export class Queue {
  private readonly concurrency: Concurrency;
  private readonly pendingTasks: QueuedTask[] = [];
  private readonly idleResolvers: Array<() => void> = [];
  private activeCount = ActiveTaskCount.ZERO;

  public constructor(options: QueueOptions = new QueueOptions()) {
    this.concurrency = options.getConcurrency();
  }

  private isIdle(): boolean {
    return this.activeCount.isZero() && this.pendingTasks.length === 0;
  }

  private drain(): void {
    while (this.activeCount.isAllowedBy(this.concurrency)) {
      const queuedTask = this.pendingTasks.shift();

      if (!queuedTask) {
        return;
      }

      void this.runQueuedTask(queuedTask);
    }
  }

  private async runQueuedTask(queuedTask: QueuedTask): Promise<void> {
    this.activeCount = this.activeCount.increment();

    try {
      await queuedTask.run();
    } finally {
      this.activeCount = this.activeCount.decrement();
      this.drain();
      this.resolveIdleWhenNeeded();
    }
  }

  private resolveIdleWhenNeeded(): void {
    if (!this.isIdle()) {
      return;
    }

    const resolvers = this.idleResolvers.splice(0);

    for (const resolve of resolvers) {
      resolve();
    }
  }

  public getConcurrency(): Concurrency {
    return this.concurrency;
  }

  public getPendingCount(): number {
    return this.pendingTasks.length;
  }

  public getActiveCount(): number {
    return this.activeCount.valueOf();
  }

  public enqueue<T>(task: () => Promise<T> | T): Promise<T> {
    const promise = new Promise<T>((resolve, reject) => {
      const queuedTask = new QueuedTask(async () => {
        resolve(await task());
      }, reject);

      this.pendingTasks.push(queuedTask);
    });

    this.drain();

    return promise;
  }

  public run<T>(task: () => Promise<T> | T): Promise<T> {
    return this.enqueue(task);
  }

  public clear(error: Error = new QueueClearedError()): void {
    const tasks = this.pendingTasks.splice(0);

    for (const queuedTask of tasks) {
      queuedTask.reject(error);
    }

    this.resolveIdleWhenNeeded();
  }

  public waitUntilIdle(): Promise<void> {
    if (this.isIdle()) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.idleResolvers.push(resolve);
    });
  }
}
