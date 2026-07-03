import { NextRunAt } from './NextRunAt';
import { TimerDelay } from './TimerDelay';

export class NextRunReservation {
  public constructor(
    private readonly nextRunAt: NextRunAt,
    private readonly delay: TimerDelay,
  ) {}

  public getDelay(): TimerDelay {
    return this.delay;
  }

  public getNextRunAt(): NextRunAt {
    return this.nextRunAt;
  }

  public waitForDelay(): Promise<void> {
    return this.delay.wait();
  }
}
