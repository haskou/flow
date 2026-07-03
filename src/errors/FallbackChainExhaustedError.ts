import { FlowError } from './FlowError';

export class FallbackChainExhaustedError extends FlowError {
  private static readonly MESSAGE = 'Fallback chain exhausted all attempts';

  public constructor() {
    super(FallbackChainExhaustedError.MESSAGE);
  }
}
