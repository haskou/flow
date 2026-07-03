import { Duration } from '@haskou/value-objects';

import { FlowAbortedError } from '../../errors/FlowAbortedError';
import { InvalidTimeoutDurationError } from '../../errors/InvalidTimeoutDurationError';
import { TimeoutError } from '../../errors/TimeoutError';
import { FlowTask } from '../flow/FlowTask';
import { TimeoutDuration } from '../value-objects/TimeoutDuration';

export class Timeout {
  private readonly duration: TimeoutDuration;

  public constructor(duration: number | Duration | TimeoutDuration) {
    this.duration = this.createDuration(duration);
  }

  private createDuration(
    value: number | Duration | TimeoutDuration,
  ): TimeoutDuration {
    try {
      return value instanceof TimeoutDuration
        ? value
        : new TimeoutDuration(value);
    } catch {
      throw new InvalidTimeoutDurationError();
    }
  }

  public run<T>(
    task: FlowTask<T> | ((signal: AbortSignal) => Promise<T> | T),
    signal: AbortSignal = new AbortController().signal,
  ): Promise<T> {
    if (signal.aborted) {
      return Promise.reject(new FlowAbortedError());
    }

    const controller = new AbortController();
    const timeoutController = new AbortController();
    const flowTask = task instanceof FlowTask ? task : new FlowTask(task);

    let cleanupParentAbort!: () => void;
    const parentAbort = new Promise<T>((_, reject) => {
      const abort = (): void => {
        reject(new FlowAbortedError());
        controller.abort();
        timeoutController.abort();
      };

      cleanupParentAbort = (): void => {
        signal.removeEventListener('abort', abort);
      };

      signal.addEventListener('abort', abort, { once: true });
    });
    const timeout = this.duration
      .toTimerDelay()
      .wait(timeoutController.signal)
      .then(() => {
        controller.abort();
        throw new TimeoutError();
      });

    return Promise.race([
      flowTask.run(controller.signal),
      timeout,
      parentAbort,
    ]).finally(() => {
      timeoutController.abort();
      cleanupParentAbort();
    });
  }
}
