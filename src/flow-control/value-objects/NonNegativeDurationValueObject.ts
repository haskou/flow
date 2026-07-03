import { Duration, Integer } from '@haskou/value-objects';

import { InvalidNonNegativeDurationValueError } from '../../errors/InvalidNonNegativeDurationValueError';
import { TimerDelay } from './TimerDelay';

export abstract class NonNegativeDurationValueObject extends Duration {
  private static ensureNonNegativeDuration(value: number | Duration): Duration {
    try {
      const duration =
        value instanceof Duration ? value : Duration.fromMilliseconds(value);
      const milliseconds = new Integer(duration.getTotalMilliseconds());

      if (milliseconds.isLessThan(0)) {
        throw new InvalidNonNegativeDurationValueError();
      }

      return duration;
    } catch (error) {
      if (error instanceof InvalidNonNegativeDurationValueError) {
        throw error;
      }

      throw new InvalidNonNegativeDurationValueError();
    }
  }

  public constructor(value: number | Duration) {
    super(NonNegativeDurationValueObject.ensureNonNegativeDuration(value));
  }

  public toTimerDelay(): TimerDelay {
    return new TimerDelay(this);
  }
}
