import { NumberValueObject } from '@haskou/value-objects';

import { PositiveIntegerValueObject } from './PositiveIntegerValueObject';
import { RetryAttemptCount } from './RetryAttemptCount';

export class RetryAttempts extends PositiveIntegerValueObject {
  public static readonly ONCE = new RetryAttempts(1);

  public constructor(value: number | NumberValueObject) {
    super(value);
  }

  public allows(attemptCount: RetryAttemptCount): boolean {
    return attemptCount.isLessThan(this);
  }
}
