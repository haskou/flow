import { FlowError } from './FlowError';

export class InvalidPositiveIntegerValueError extends FlowError {
  private static readonly MESSAGE = 'Flow value must be a positive integer';

  public constructor() {
    super(InvalidPositiveIntegerValueError.MESSAGE);
  }
}
