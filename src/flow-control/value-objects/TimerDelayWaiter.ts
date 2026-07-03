import { FlowAbortedError } from '../../errors/FlowAbortedError';
import { TimerDelay } from './TimerDelay';

export class TimerDelayWaiter {
  private timeout?: NodeJS.Timeout;

  public constructor(
    private readonly delay: TimerDelay,
    private readonly signal: AbortSignal,
  ) {}

  private clear(): void {
    clearTimeout(this.timeout);
    this.timeout = undefined;
  }

  public wait(): Promise<void> {
    if (this.signal.aborted) {
      return Promise.reject(new FlowAbortedError());
    }

    if (this.delay.isZero()) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const abort = (): void => {
        this.clear();
        this.signal.removeEventListener('abort', abort);
        reject(new FlowAbortedError());
      };

      this.timeout = this.delay.setTimeout(() => {
        this.signal.removeEventListener('abort', abort);
        resolve();
      });

      this.signal.addEventListener('abort', abort);
    });
  }
}
