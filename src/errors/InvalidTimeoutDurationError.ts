import { FlowError } from './FlowError';

export class InvalidTimeoutDurationError extends FlowError {
  private static readonly MESSAGE =
    'Timeout duration must be a positive integer';

  public constructor() {
    super(InvalidTimeoutDurationError.MESSAGE);
  }
}
