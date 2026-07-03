import { FlowError } from './FlowError';

export class FlowTaskMissingError extends FlowError {
  private static readonly MESSAGE = 'Flow task is missing';

  public constructor() {
    super(FlowTaskMissingError.MESSAGE);
  }
}
