import { FlowError } from './FlowError';

export class CircuitBreakerOpenError extends FlowError {
  private static readonly MESSAGE = 'Circuit breaker is open';

  public constructor() {
    super(CircuitBreakerOpenError.MESSAGE);
  }
}
