import { Duration } from '@haskou/value-objects';

import { TimerDelayWaiter } from './TimerDelayWaiter';

export class TimerDelay {
  public constructor(private readonly duration: Duration) {}

  public isZero(): boolean {
    return this.duration.isZero();
  }

  public wait(
    signal: AbortSignal = new AbortController().signal,
  ): Promise<void> {
    return new TimerDelayWaiter(this, signal).wait();
  }

  public setTimeout(callback: () => void): NodeJS.Timeout {
    return setTimeout(callback, this.duration.getTotalMilliseconds().valueOf());
  }

  public setInterval(callback: () => void): NodeJS.Timeout {
    return setInterval(
      callback,
      this.duration.getTotalMilliseconds().valueOf(),
    );
  }

  public getDuration(): Duration {
    return this.duration;
  }
}
