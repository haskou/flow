import { FlowError } from './FlowError';

export class SchedulerAlreadyRunningError extends FlowError {
  private static readonly MESSAGE = 'Scheduler is running';

  public constructor() {
    super(SchedulerAlreadyRunningError.MESSAGE);
  }
}
