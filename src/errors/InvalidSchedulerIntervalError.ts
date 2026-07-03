import { FlowError } from './FlowError';

export class InvalidSchedulerIntervalError extends FlowError {
  private static readonly MESSAGE =
    'Scheduler interval must be a positive integer';

  public constructor() {
    super(InvalidSchedulerIntervalError.MESSAGE);
  }
}
