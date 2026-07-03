import { NumberValueObject } from '@haskou/value-objects';

import { CircuitBreakerSuccessThreshold } from './CircuitBreakerSuccessThreshold';
import { NonNegativeIntegerValueObject } from './NonNegativeIntegerValueObject';

export class CircuitBreakerSuccessCount extends NonNegativeIntegerValueObject {
  public static readonly ZERO = new CircuitBreakerSuccessCount(0);

  public constructor(value: number | NumberValueObject) {
    super(value);
  }

  public increment(): CircuitBreakerSuccessCount {
    return new CircuitBreakerSuccessCount(this.add(1));
  }

  public hasReached(threshold: CircuitBreakerSuccessThreshold): boolean {
    return this.isGreaterOrEqualThan(threshold);
  }
}
