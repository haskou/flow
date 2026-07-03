import { NumberValueObject } from '@haskou/value-objects';

import type { SemaphoreCapacity } from './SemaphoreCapacity';

import { NonNegativeIntegerValueObject } from './NonNegativeIntegerValueObject';

export class SemaphorePermits extends NonNegativeIntegerValueObject {
  public constructor(value: number | NumberValueObject) {
    super(value);
  }

  public useOne(): SemaphorePermits {
    return new SemaphorePermits(this.subtract(1));
  }

  public releaseOne(capacity: SemaphoreCapacity): SemaphorePermits {
    const released = new SemaphorePermits(this.add(1));

    if (released.isGreaterThan(capacity)) {
      return new SemaphorePermits(capacity);
    }

    return released;
  }
}
