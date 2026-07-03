import { Duration } from '@haskou/value-objects';

import { PositiveDurationValueObject } from './PositiveDurationValueObject';

export class CircuitBreakerRecoveryTimeout extends PositiveDurationValueObject {
  public constructor(value: number | Duration) {
    super(value);
  }
}
