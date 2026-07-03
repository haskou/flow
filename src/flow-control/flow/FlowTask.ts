export class FlowTask<T> {
  public constructor(
    private readonly task: (signal: AbortSignal) => Promise<T> | T,
  ) {}

  public run(signal: AbortSignal): Promise<T> {
    try {
      return Promise.resolve(this.task(signal));
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
