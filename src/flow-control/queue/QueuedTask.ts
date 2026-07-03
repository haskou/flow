export class QueuedTask {
  public constructor(
    private readonly task: () => Promise<void> | void,
    private readonly rejectCallback: (error: unknown) => void,
  ) {}

  public async run(): Promise<void> {
    try {
      await this.task();
    } catch (error) {
      this.rejectCallback(error);
    }
  }

  public reject(error: Error): void {
    this.rejectCallback(error);
  }
}
