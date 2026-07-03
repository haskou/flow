import { FlowAbortedError } from '../../errors/FlowAbortedError';
import { SemaphorePermit } from './SemaphorePermit';

export class SemaphoreWaiter {
  private signal?: AbortSignal;
  private onAbort!: () => void;

  public constructor(
    private readonly resolve: (permit: SemaphorePermit) => void,
    private readonly reject: (error: Error) => void,
  ) {}

  private abortFromSignal = (): void => {
    this.onAbort();
    this.cleanup();
    this.reject(new FlowAbortedError());
  };

  private cleanup(): void {
    if (!this.signal) {
      return;
    }

    this.signal.removeEventListener('abort', this.abortFromSignal);
    this.signal = undefined;
  }

  public watchAbort(signal: AbortSignal, onAbort: () => void): void {
    this.signal = signal;
    this.onAbort = onAbort;
    this.signal.addEventListener('abort', this.abortFromSignal);
  }

  public grant(permit: SemaphorePermit): void {
    this.cleanup();
    this.resolve(permit);
  }
}
