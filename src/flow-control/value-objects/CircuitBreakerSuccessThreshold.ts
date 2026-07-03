import { NumberValueObject } from '@haskou/value-objects';

import { PositiveIntegerValueObject } from './PositiveIntegerValueObject';

export class CircuitBreakerSuccessThreshold extends PositiveIntegerValueObject {
  public constructor(value: number | NumberValueObject) {
    super(value);
  }
}
