import { Duration, Timestamp } from '@haskou/value-objects';

import { NextRunReservation } from './NextRunReservation';
import { TimerDelay } from './TimerDelay';

export class NextRunAt {
  private static readonly NO_DELAY_MILLISECONDS = 0;

  public static immediate(): NextRunAt {
    return new NextRunAt(Timestamp.now());
  }

  public constructor(private readonly timestamp: Timestamp) {}

  private getDelayUntil(now: Timestamp): Duration {
    if (this.timestamp.isBeforeOrEqual(now)) {
      return Duration.fromMilliseconds(NextRunAt.NO_DELAY_MILLISECONDS);
    }

    return Duration.fromMilliseconds(
      this.timestamp.toMilliseconds() - now.toMilliseconds(),
    );
  }

  public reserve(now: Timestamp, interval: Duration): NextRunReservation {
    const delay = this.getDelayUntil(now);
    const baseline = this.timestamp.isAfter(now) ? this.timestamp : now;

    return new NextRunReservation(
      new NextRunAt(baseline.addDuration(interval)),
      new TimerDelay(delay),
    );
  }
}
