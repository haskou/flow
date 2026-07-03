import { FlowTask } from '../flow/FlowTask';
import { RetryAttemptCount } from '../value-objects/RetryAttemptCount';
import { RetryAttempts } from '../value-objects/RetryAttempts';
import { RetryDelay } from '../value-objects/RetryDelay';
import { RetryOptions } from './RetryOptions';

export class Retrier {
  private readonly attempts: RetryAttempts;
  private readonly delay: RetryDelay;

  public constructor(options: RetryOptions = new RetryOptions()) {
    this.attempts = options.getAttempts();
    this.delay = options.getDelay();
  }

  private waitBeforeNextAttempt(): Promise<void> {
    return this.delay.toTimerDelay().wait();
  }

  public async run<T>(
    task: FlowTask<T> | ((signal: AbortSignal) => Promise<T> | T),
    signal: AbortSignal = new AbortController().signal,
  ): Promise<T> {
    const flowTask = task instanceof FlowTask ? task : new FlowTask(task);
    let attemptCount = RetryAttemptCount.ZERO;

    for (;;) {
      try {
        return await flowTask.run(signal);
      } catch (error) {
        attemptCount = attemptCount.increment();

        if (!attemptCount.isAllowedBy(this.attempts)) {
          throw error;
        }

        await this.waitBeforeNextAttempt();
      }
    }
  }
}
