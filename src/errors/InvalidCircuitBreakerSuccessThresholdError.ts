import { FlowError } from './FlowError';

export class InvalidCircuitBreakerSuccessThresholdError extends FlowError {
  private static readonly MESSAGE =
    'Circuit breaker success threshold must be a positive integer';

  public constructor() {
    super(InvalidCircuitBreakerSuccessThresholdError.MESSAGE);
  }
}
