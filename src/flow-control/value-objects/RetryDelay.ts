import { Duration } from '@haskou/value-objects';

import { NonNegativeDurationValueObject } from './NonNegativeDurationValueObject';

export class RetryDelay extends NonNegativeDurationValueObject {
  public static none(): RetryDelay {
    return new RetryDelay(Duration.fromMilliseconds(0));
  }

  public constructor(value: number | Duration) {
    super(value);
  }
}
