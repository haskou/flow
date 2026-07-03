import { Enum } from '@haskou/value-objects';

const circuitBreakerStateValues = {
  CLOSED: 'closed',
  HALF_OPEN: 'half-open',
  OPEN: 'open',
};

export class CircuitBreakerState extends Enum<string> {
  public static readonly CLOSED = new CircuitBreakerState(
    circuitBreakerStateValues.CLOSED,
  );

  public static readonly OPEN = new CircuitBreakerState(
    circuitBreakerStateValues.OPEN,
  );

  public static readonly HALF_OPEN = new CircuitBreakerState(
    circuitBreakerStateValues.HALF_OPEN,
  );

  public static fromPrimitives(value: string): CircuitBreakerState {
    return new CircuitBreakerState(value);
  }

  private constructor(value: string) {
    super(value);
  }

  public getValues(): string[] {
    return Object.values(circuitBreakerStateValues);
  }

  public isClosed(): boolean {
    return this.isEqual(CircuitBreakerState.CLOSED);
  }

  public isOpen(): boolean {
    return this.isEqual(CircuitBreakerState.OPEN);
  }

  public isHalfOpen(): boolean {
    return this.isEqual(CircuitBreakerState.HALF_OPEN);
  }

  public open(): CircuitBreakerState {
    return CircuitBreakerState.OPEN;
  }

  public halfOpen(): CircuitBreakerState {
    return CircuitBreakerState.HALF_OPEN;
  }

  public close(): CircuitBreakerState {
    return CircuitBreakerState.CLOSED;
  }
}
