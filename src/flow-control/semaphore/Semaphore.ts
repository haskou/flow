import { InvalidSemaphorePermitsError } from '../../errors/InvalidSemaphorePermitsError';
import { SemaphoreCapacity } from '../value-objects/SemaphoreCapacity';
import { SemaphorePermits } from '../value-objects/SemaphorePermits';
import { SemaphorePermit } from './SemaphorePermit';

export class Semaphore {
  private readonly capacity: SemaphoreCapacity;
  private readonly waiters: Array<(permit: SemaphorePermit) => void> = [];
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

    waiter(new SemaphorePermit(() => this.releasePermit()));
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

  public acquire(): Promise<SemaphorePermit> {
    const permit = this.tryAcquire();

    if (permit) {
      return Promise.resolve(permit);
    }

    return new Promise((resolve) => {
      this.waiters.push(resolve);
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
