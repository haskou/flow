import { FlowError } from './FlowError';

export class InvalidDebouncerDelayError extends FlowError {
  private static readonly MESSAGE =
    'Debouncer delay must be a positive integer';

  public constructor() {
    super(InvalidDebouncerDelayError.MESSAGE);
  }
}
