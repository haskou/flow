import { FlowError } from './FlowError';

export class InvalidRetryDelayError extends FlowError {
  private static readonly MESSAGE =
    'Retry delay must be a non-negative integer';

  public constructor() {
    super(InvalidRetryDelayError.MESSAGE);
  }
}
