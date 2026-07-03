import { FlowError } from './FlowError';

export class InvalidRateLimiterIntervalError extends FlowError {
  private static readonly MESSAGE =
    'Rate limiter interval must be a positive integer';

  public constructor() {
    super(InvalidRateLimiterIntervalError.MESSAGE);
  }
}
