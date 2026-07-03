import { FlowError } from './FlowError';

export class InvalidCircuitBreakerFailureThresholdError extends FlowError {
  private static readonly MESSAGE =
    'Circuit breaker failure threshold must be a positive integer';

  public constructor() {
    super(InvalidCircuitBreakerFailureThresholdError.MESSAGE);
  }
}
