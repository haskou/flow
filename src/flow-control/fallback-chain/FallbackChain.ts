import { FallbackChainExhaustedError } from '../../errors/FallbackChainExhaustedError';
import { FallbackAttempt } from './FallbackAttempt';

export class FallbackChain<T> {
  private readonly attempts: Array<FallbackAttempt<T>> = [];

  private async runAttempt(
    attempt: FallbackAttempt<T>,
  ): Promise<T | null | undefined> {
    try {
      return await attempt.run();
    } catch {
      return null;
    }
  }

  public try(
    attempt: () => Promise<T | null | undefined> | T | null | undefined,
  ): FallbackChain<T> {
    this.attempts.push(new FallbackAttempt(attempt));

    return this;
  }

  public async run(): Promise<T> {
    for (const attempt of this.attempts) {
      const value = await this.runAttempt(attempt);

      if (value) {
        return value;
      }
    }

    throw new FallbackChainExhaustedError();
  }
}
