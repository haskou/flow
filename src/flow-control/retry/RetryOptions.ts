import { Duration } from '@haskou/value-objects';

import { InvalidRetryAttemptsError } from '../../errors/InvalidRetryAttemptsError';
import { InvalidRetryDelayError } from '../../errors/InvalidRetryDelayError';
import { RetryAttempts } from '../value-objects/RetryAttempts';
import { RetryDelay } from '../value-objects/RetryDelay';

export class RetryOptions {
  private readonly attempts: RetryAttempts;
  private readonly delay: RetryDelay;

  public constructor(
    attempts: number | RetryAttempts = RetryAttempts.ONCE,
    delay: number | Duration | RetryDelay = RetryDelay.none(),
  ) {
    this.attempts = this.createAttempts(attempts);
    this.delay = this.createDelay(delay);
  }

  private createAttempts(value: number | RetryAttempts): RetryAttempts {
    try {
      return value instanceof RetryAttempts ? value : new RetryAttempts(value);
    } catch {
      throw new InvalidRetryAttemptsError();
    }
  }

  private createDelay(value: number | Duration | RetryDelay): RetryDelay {
    try {
      return value instanceof RetryDelay ? value : new RetryDelay(value);
    } catch {
      throw new InvalidRetryDelayError();
    }
  }

  public getAttempts(): RetryAttempts {
    return this.attempts;
  }

  public getDelay(): RetryDelay {
    return this.delay;
  }
}
