import { FlowError } from './FlowError';

export class InvalidRetryAttemptsError extends FlowError {
  private static readonly MESSAGE = 'Retry attempts must be a positive integer';

  public constructor() {
    super(InvalidRetryAttemptsError.MESSAGE);
  }
}
