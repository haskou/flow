import { FlowError } from './FlowError';

export class FlowAbortedError extends FlowError {
  private static readonly MESSAGE = 'Flow execution was aborted';

  public constructor() {
    super(FlowAbortedError.MESSAGE);
  }
}
