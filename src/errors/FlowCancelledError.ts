import { FlowError } from './FlowError';

export class FlowCancelledError extends FlowError {
  private static readonly MESSAGE = 'Flow operation was cancelled';

  public constructor() {
    super(FlowCancelledError.MESSAGE);
  }
}
