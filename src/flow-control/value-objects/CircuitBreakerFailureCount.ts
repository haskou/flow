import { NumberValueObject } from '@haskou/value-objects';

import { CircuitBreakerFailureThreshold } from './CircuitBreakerFailureThreshold';
import { NonNegativeIntegerValueObject } from './NonNegativeIntegerValueObject';

export class CircuitBreakerFailureCount extends NonNegativeIntegerValueObject {
  public static readonly ZERO = new CircuitBreakerFailureCount(0);

  public constructor(value: number | NumberValueObject) {
    super(value);
  }

  public increment(): CircuitBreakerFailureCount {
    return new CircuitBreakerFailureCount(this.add(1));
  }

  public hasReached(threshold: CircuitBreakerFailureThreshold): boolean {
    return this.isGreaterOrEqualThan(threshold);
  }
}
