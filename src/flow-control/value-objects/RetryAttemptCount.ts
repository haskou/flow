import { NumberValueObject } from '@haskou/value-objects';

import type { RetryAttempts } from './RetryAttempts';

import { NonNegativeIntegerValueObject } from './NonNegativeIntegerValueObject';

export class RetryAttemptCount extends NonNegativeIntegerValueObject {
  public static readonly ZERO = new RetryAttemptCount(0);

  public constructor(value: number | NumberValueObject) {
    super(value);
  }

  public increment(): RetryAttemptCount {
    return new RetryAttemptCount(this.add(1));
  }

  public isAllowedBy(attempts: RetryAttempts): boolean {
    return attempts.allows(this);
  }
}
