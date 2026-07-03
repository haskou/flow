import { FallbackChainExhaustedError } from '../../errors/FallbackChainExhaustedError';
import { FallbackAttempt } from './FallbackAttempt';
import { FallbackChainOptions } from './FallbackChainOptions';

export class FallbackChain<T> {
  private readonly attempts: Array<FallbackAttempt<T>> = [];
  private readonly errorHandlers: Array<(error: unknown) => void> = [];

  public constructor(
    private readonly options: FallbackChainOptions<T> = FallbackChainOptions.default<T>(),
  ) {}

  private async runAttempt(
    attempt: FallbackAttempt<T>,
  ): Promise<T | null | undefined> {
    try {
      return await attempt.run();
    } catch (error) {
      this.notifyError(error);

      if (this.options.shouldCatchErrors()) {
        return null;
      }

      throw error;
    }
  }

  private notifyError(error: unknown): void {
    for (const errorHandler of this.errorHandlers) {
      errorHandler(error);
    }
  }

  public try(
    attempt: () => Promise<T | null | undefined> | T | null | undefined,
  ): FallbackChain<T> {
    this.attempts.push(new FallbackAttempt(attempt));

    return this;
  }

  public onError(errorHandler: (error: unknown) => void): FallbackChain<T> {
    this.errorHandlers.push(errorHandler);

    return this;
  }

  public async run(): Promise<T> {
    for (const attempt of this.attempts) {
      const value = await this.runAttempt(attempt);

      if (this.options.isResolvedValue(value)) {
        return value;
      }
    }

    throw new FallbackChainExhaustedError();
  }
}
