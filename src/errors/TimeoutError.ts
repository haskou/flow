import { FlowError } from './FlowError';

export class TimeoutError extends FlowError {
  private static readonly MESSAGE = 'Flow execution timed out';

  public constructor() {
    super(TimeoutError.MESSAGE);
  }
}
