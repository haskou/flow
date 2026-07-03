import { Duration } from '@haskou/value-objects';

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
    const controller = new AbortController();
    const flowTask = task instanceof FlowTask ? task : new FlowTask(task);
    const timeout = new Promise<T>((_, reject) => {
      this.duration.toTimerDelay().setTimeout(() => {
        controller.abort();
        reject(new TimeoutError());
      });
    });

    signal.addEventListener('abort', () => {
      controller.abort();
    });

    return Promise.race([flowTask.run(controller.signal), timeout]);
  }
}
