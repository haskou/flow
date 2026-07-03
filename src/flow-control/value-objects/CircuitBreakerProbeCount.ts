import { NumberValueObject } from '@haskou/value-objects';

import { Concurrency } from './Concurrency';
import { NonNegativeIntegerValueObject } from './NonNegativeIntegerValueObject';

export class CircuitBreakerProbeCount extends NonNegativeIntegerValueObject {
  public static readonly ZERO = new CircuitBreakerProbeCount(0);

  public constructor(value: number | NumberValueObject) {
    super(value);
  }

  public increment(): CircuitBreakerProbeCount {
    return new CircuitBreakerProbeCount(this.add(1));
  }

  public decrement(): CircuitBreakerProbeCount {
    if (this.isZero()) {
      return CircuitBreakerProbeCount.ZERO;
    }

    return new CircuitBreakerProbeCount(this.subtract(1));
  }

  public isAllowedBy(concurrency: Concurrency): boolean {
    return concurrency.allows(this);
  }
}
