import { Duration, Integer } from '@haskou/value-objects';

import { InvalidPositiveDurationValueError } from '../../errors/InvalidPositiveDurationValueError';
import { TimerDelay } from './TimerDelay';

export abstract class PositiveDurationValueObject extends Duration {
  private static ensurePositiveDuration(value: number | Duration): Duration {
    try {
      const duration =
        value instanceof Duration ? value : Duration.fromMilliseconds(value);
      const milliseconds = new Integer(duration.getTotalMilliseconds());

      if (!milliseconds.isGreaterThan(0)) {
        throw new InvalidPositiveDurationValueError();
      }

      return duration;
    } catch (error) {
      if (error instanceof InvalidPositiveDurationValueError) {
        throw error;
      }

      throw new InvalidPositiveDurationValueError();
    }
  }

  public constructor(value: number | Duration) {
    super(PositiveDurationValueObject.ensurePositiveDuration(value));
  }

  public toTimerDelay(): TimerDelay {
    return new TimerDelay(this);
  }
}
