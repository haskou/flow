import { FlowError } from './FlowError';

export class InvalidCircuitBreakerRecoveryTimeoutError extends FlowError {
  private static readonly MESSAGE =
    'Circuit breaker recovery timeout must be a positive integer';

  public constructor() {
    super(InvalidCircuitBreakerRecoveryTimeoutError.MESSAGE);
  }
}
