import { FlowError } from './FlowError';

export class SemaphoreReleasedError extends FlowError {
  private static readonly MESSAGE =
    'Semaphore permit has already been released';

  public constructor() {
    super(SemaphoreReleasedError.MESSAGE);
  }
}
