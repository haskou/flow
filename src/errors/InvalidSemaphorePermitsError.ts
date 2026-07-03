import { FlowError } from './FlowError';

export class InvalidSemaphorePermitsError extends FlowError {
  private static readonly MESSAGE =
    'Semaphore permits must be a positive integer';

  public constructor() {
    super(InvalidSemaphorePermitsError.MESSAGE);
  }
}
