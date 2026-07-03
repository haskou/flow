import { FlowError } from './FlowError';

export class InvalidThrottlerIntervalError extends FlowError {
  private static readonly MESSAGE =
    'Throttler interval must be a positive integer';

  public constructor() {
    super(InvalidThrottlerIntervalError.MESSAGE);
  }
}
