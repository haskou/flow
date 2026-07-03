import { FlowError } from './FlowError';

export class InvalidQueueConcurrencyError extends FlowError {
  private static readonly MESSAGE =
    'Queue concurrency must be a positive integer';

  public constructor() {
    super(InvalidQueueConcurrencyError.MESSAGE);
  }
}
