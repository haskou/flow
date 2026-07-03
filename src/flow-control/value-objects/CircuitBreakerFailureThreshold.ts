import { NumberValueObject } from '@haskou/value-objects';

import { PositiveIntegerValueObject } from './PositiveIntegerValueObject';

export class CircuitBreakerFailureThreshold extends PositiveIntegerValueObject {
  public constructor(value: number | NumberValueObject) {
    super(value);
  }
}
