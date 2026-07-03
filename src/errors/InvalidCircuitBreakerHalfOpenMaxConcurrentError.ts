import { FlowError } from './FlowError';

export class InvalidCircuitBreakerHalfOpenMaxConcurrentError extends FlowError {
  private static readonly MESSAGE =
    'Circuit breaker half-open max concurrent must be a positive integer';

  public constructor() {
    super(InvalidCircuitBreakerHalfOpenMaxConcurrentError.MESSAGE);
  }
}
