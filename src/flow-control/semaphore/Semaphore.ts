import { FlowAbortedError } from '../../errors/FlowAbortedError';
import { InvalidSemaphorePermitsError } from '../../errors/InvalidSemaphorePermitsError';
import { SemaphoreCapacity } from '../value-objects/SemaphoreCapacity';
import { SemaphorePermits } from '../value-objects/SemaphorePermits';
import { SemaphorePermit } from './SemaphorePermit';
import { SemaphoreWaiter } from './SemaphoreWaiter';

export class Semaphore {
  private readonly capacity: SemaphoreCapacity;
  private waiters: SemaphoreWaiter[] = [];
  private availablePermits: SemaphorePermits;

  public constructor(permits: number | SemaphoreCapacity) {
    try {
      this.capacity =
        permits instanceof SemaphoreCapacity
          ? permits
          : new SemaphoreCapacity(permits);
    } catch {
      throw new InvalidSemaphorePermitsError();
    }

    this.availablePermits = this.capacity.toAvailablePermits();
  }

  private releasePermit(): void {
    const waiter = this.waiters.shift();

    if (!waiter) {
      this.availablePermits = this.availablePermits.releaseOne(this.capacity);

      return;
    }

    waiter.grant(new SemaphorePermit(() => this.releasePermit()));
  }

  private removeWaiter(waiter: SemaphoreWaiter): void {
    this.waiters = this.waiters.filter(
      (queuedWaiter) => queuedWaiter !== waiter,
    );
  }

  public getCapacity(): number {
    return this.capacity.valueOf();
  }

  public getAvailablePermits(): number {
    return this.availablePermits.valueOf();
  }

  public getWaitingCount(): number {
    return this.waiters.length;
  }

  public acquire(
    signal: AbortSignal = new AbortController().signal,
  ): Promise<SemaphorePermit> {
    if (signal.aborted) {
      return Promise.reject(new FlowAbortedError());
    }

    const permit = this.tryAcquire();

    if (permit) {
      return Promise.resolve(permit);
    }

    return new Promise((resolve, reject) => {
      const waiter = new SemaphoreWaiter(resolve, reject);
      waiter.watchAbort(signal, () => {
        this.removeWaiter(waiter);
      });
      this.waiters.push(waiter);
    });
  }

  public tryAcquire(): SemaphorePermit | null {
    if (this.availablePermits.isZero()) {
      return null;
    }

    this.availablePermits = this.availablePermits.useOne();

    return new SemaphorePermit(() => this.releasePermit());
  }

  public async runExclusive<T>(task: () => Promise<T> | T): Promise<T> {
    const permit = await this.acquire();

    try {
      return await task();
    } finally {
      permit.release();
    }
  }

  public run<T>(task: () => Promise<T> | T): Promise<T> {
    return this.runExclusive(task);
  }
}
