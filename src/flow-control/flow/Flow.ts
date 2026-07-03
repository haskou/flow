import { Duration } from '@haskou/value-objects';

import { FlowTaskMissingError } from '../../errors/FlowTaskMissingError';
import { Abortable } from '../abortable/Abortable';
import { CircuitBreaker } from '../circuit-breaker/CircuitBreaker';
import { Queue } from '../queue/Queue';
import { Racer } from '../racer/Racer';
import { RateLimiter } from '../rate-limiter/RateLimiter';
import { Retrier } from '../retry/Retrier';
import { RetryOptions } from '../retry/RetryOptions';
import { Semaphore } from '../semaphore/Semaphore';
import { Throttler } from '../throttler/Throttler';
import { Timeout } from '../timeout/Timeout';
import { RetryAttempts } from '../value-objects/RetryAttempts';
import { RetryDelay } from '../value-objects/RetryDelay';
import { TimeoutDuration } from '../value-objects/TimeoutDuration';
import { FlowLimit } from './FlowLimit';
import { FlowRunController } from './FlowRunController';
import { FlowTask } from './FlowTask';

export class Flow<T = unknown> {
  public constructor(
    private readonly flowTask?: FlowTask<T>,
    private readonly controllers: Array<{
      run<TResult>(
        task: FlowTask<TResult>,
        signal: AbortSignal,
      ): Promise<TResult>;
    }> = [],
    private readonly abortController?: Abortable,
  ) {}

  private withController(controller: {
    run<TResult>(
      task: FlowTask<TResult>,
      signal: AbortSignal,
    ): Promise<TResult>;
  }): Flow<T> {
    return new Flow<T>(
      this.flowTask,
      [...this.controllers, controller],
      this.abortController,
    );
  }

  private createRetryOptions(
    options:
      | RetryOptions
      | {
          attempts: number | RetryAttempts;
          delay?: number | Duration | RetryDelay;
        },
  ): RetryOptions {
    if (options instanceof RetryOptions) {
      return options;
    }

    return new RetryOptions(
      options.attempts,
      options.delay ?? RetryDelay.none(),
    );
  }

  public task<TResult>(
    task: (signal: AbortSignal) => Promise<TResult> | TResult,
  ): Flow<TResult> {
    return new Flow<TResult>(
      new FlowTask(task),
      this.controllers,
      this.abortController,
    );
  }

  public race<TResult>(racer: Racer<TResult>): Flow<TResult> {
    return this.task((signal) => racer.run(signal));
  }

  public through(controller: {
    run<TResult>(
      task: FlowTask<TResult>,
      signal: AbortSignal,
    ): Promise<TResult>;
  }): Flow<T> {
    return this.withController(controller);
  }

  public queue(queue: Queue): Flow<T> {
    return this.withController(new FlowRunController(queue));
  }

  public rateLimit(rateLimiter: RateLimiter): Flow<T> {
    return this.withController(new FlowRunController(rateLimiter));
  }

  public throttle(throttler: Throttler): Flow<T> {
    return this.withController(new FlowRunController(throttler));
  }

  public circuitBreaker(circuitBreaker: CircuitBreaker): Flow<T> {
    return this.withController(new FlowRunController(circuitBreaker));
  }

  public limit(semaphore: Semaphore): Flow<T> {
    return this.withController(new FlowLimit(semaphore));
  }

  public timeout(duration: number | Duration | TimeoutDuration): Flow<T> {
    return this.withController(new Timeout(duration));
  }

  public retry(
    options:
      | RetryOptions
      | {
          attempts: number | RetryAttempts;
          delay?: number | Duration | RetryDelay;
        },
  ): Flow<T> {
    return this.withController(new Retrier(this.createRetryOptions(options)));
  }

  public abortable(abortable: Abortable): Flow<T> {
    return new Flow<T>(this.flowTask, this.controllers, abortable);
  }

  public run(): Promise<T> {
    if (!this.flowTask) {
      return Promise.reject(new FlowTaskMissingError());
    }

    let wrappedTask = this.flowTask;

    for (const controller of [...this.controllers].reverse()) {
      const currentTask = wrappedTask;
      wrappedTask = new FlowTask((signal) =>
        controller.run(currentTask, signal),
      );
    }

    if (this.abortController) {
      return this.abortController.run(wrappedTask);
    }

    return wrappedTask.run(new AbortController().signal);
  }
}
