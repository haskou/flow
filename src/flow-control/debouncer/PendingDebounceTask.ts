import { FlowCancelledError } from '../../errors/FlowCancelledError';

export class PendingDebounceTask<T> {
  public static empty<T>(): PendingDebounceTask<T> {
    return new PendingDebounceTask<T>();
  }

  public static fromTask<T>(
    task: () => Promise<T> | T,
  ): PendingDebounceTask<T> {
    return new PendingDebounceTask<T>(task);
  }

  private constructor(private readonly task?: () => Promise<T> | T) {}

  public isEmpty(): boolean {
    return !this.task;
  }

  public async run(): Promise<T> {
    if (!this.task) {
      throw new FlowCancelledError();
    }

    return this.task();
  }
}
