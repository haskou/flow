import { Duration, Timestamp } from '@haskou/value-objects';

export class CircuitBreakerOpenedAt {
  public static closed(): CircuitBreakerOpenedAt {
    return new CircuitBreakerOpenedAt();
  }

  public static now(): CircuitBreakerOpenedAt {
    return new CircuitBreakerOpenedAt(Timestamp.now());
  }

  private constructor(private readonly timestamp?: Timestamp) {}

  public hasRecoveryElapsed(
    recoveryTimeout: Duration,
    now: Timestamp,
  ): boolean {
    if (!this.timestamp) {
      return false;
    }

    return this.timestamp.addDuration(recoveryTimeout).isBeforeOrEqual(now);
  }
}
