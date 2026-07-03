import { NumberValueObject } from '@haskou/value-objects';

import { PositiveIntegerValueObject } from './PositiveIntegerValueObject';
import { SemaphorePermits } from './SemaphorePermits';

export class SemaphoreCapacity extends PositiveIntegerValueObject {
  public constructor(value: number | NumberValueObject) {
    super(value);
  }

  public toAvailablePermits(): SemaphorePermits {
    return new SemaphorePermits(this);
  }
}
