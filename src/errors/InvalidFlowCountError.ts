import { FlowError } from './FlowError';

export class InvalidFlowCountError extends FlowError {
  private static readonly MESSAGE = 'Flow counts must be non-negative integers';

  public constructor() {
    super(InvalidFlowCountError.MESSAGE);
  }
}
