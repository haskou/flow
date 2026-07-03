import { Duration } from '@haskou/value-objects';

export class TimerDelay {
  public constructor(private readonly duration: Duration) {}

  public isZero(): boolean {
    return this.duration.isZero();
  }

  public wait(): Promise<void> {
    if (this.isZero()) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.setTimeout(resolve);
    });
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
