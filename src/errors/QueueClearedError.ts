import { FlowError } from './FlowError';

export class QueueClearedError extends FlowError {
  private static readonly MESSAGE = 'Queue was cleared before the task started';

  public constructor() {
    super(QueueClearedError.MESSAGE);
  }
}
