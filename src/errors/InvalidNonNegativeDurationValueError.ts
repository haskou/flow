import { FlowError } from './FlowError';

export class InvalidNonNegativeDurationValueError extends FlowError {
  private static readonly MESSAGE =
    'Flow duration must be a non-negative integer';

  public constructor() {
    super(InvalidNonNegativeDurationValueError.MESSAGE);
  }
}
