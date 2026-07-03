export class FallbackChainOptions<T> {
  public static default<T>(): FallbackChainOptions<T> {
    return new FallbackChainOptions<T>(
      false,
      (value): value is T => value !== null && value !== undefined,
    );
  }

  public static catchingErrors<T>(): FallbackChainOptions<T> {
    return new FallbackChainOptions<T>(
      true,
      (value): value is T => value !== null && value !== undefined,
    );
  }

  public constructor(
    private readonly catchErrors = false,
    private readonly isResolved: (value: T | null | undefined) => value is T = (
      value,
    ): value is T => value !== null && value !== undefined,
  ) {}

  public shouldCatchErrors(): boolean {
    return this.catchErrors;
  }

  public isResolvedValue(value: T | null | undefined): value is T {
    return this.isResolved(value);
  }
}
