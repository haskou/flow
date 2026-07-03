import { FlowError } from './FlowError';

export class InvalidPositiveDurationValueError extends FlowError {
  private static readonly MESSAGE = 'Flow duration must be a positive integer';

  public constructor() {
    super(InvalidPositiveDurationValueError.MESSAGE);
  }
}
