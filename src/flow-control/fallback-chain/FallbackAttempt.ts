export class FallbackAttempt<T> {
  public constructor(
    private readonly attempt: () =>
      Promise<T | null | undefined> | T | null | undefined,
  ) {}

  public async run(): Promise<T | null | undefined> {
    return this.attempt();
  }
}
