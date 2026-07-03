import { Duration } from '@haskou/value-objects';

import { InvalidCircuitBreakerFailureThresholdError } from '../../errors/InvalidCircuitBreakerFailureThresholdError';
import { InvalidCircuitBreakerHalfOpenMaxConcurrentError } from '../../errors/InvalidCircuitBreakerHalfOpenMaxConcurrentError';
import { InvalidCircuitBreakerRecoveryTimeoutError } from '../../errors/InvalidCircuitBreakerRecoveryTimeoutError';
import { InvalidCircuitBreakerSuccessThresholdError } from '../../errors/InvalidCircuitBreakerSuccessThresholdError';
import { CircuitBreakerFailureThreshold } from '../value-objects/CircuitBreakerFailureThreshold';
import { CircuitBreakerRecoveryTimeout } from '../value-objects/CircuitBreakerRecoveryTimeout';
import { CircuitBreakerSuccessThreshold } from '../value-objects/CircuitBreakerSuccessThreshold';
import { Concurrency } from '../value-objects/Concurrency';

export class CircuitBreakerOptions {
  private readonly failureThreshold: CircuitBreakerFailureThreshold;
  private readonly halfOpenMaxConcurrent: Concurrency;
  private readonly recoveryTimeout: CircuitBreakerRecoveryTimeout;
  private readonly successThreshold: CircuitBreakerSuccessThreshold;

  public constructor(
    failureThreshold: number | CircuitBreakerFailureThreshold,
    recoveryTimeout: number | Duration | CircuitBreakerRecoveryTimeout,
    successThreshold: number | CircuitBreakerSuccessThreshold = 1,
    halfOpenMaxConcurrent: number | Concurrency = 1,
  ) {
    this.failureThreshold = this.createFailureThreshold(failureThreshold);
    this.recoveryTimeout = this.createRecoveryTimeout(recoveryTimeout);
    this.successThreshold = this.createSuccessThreshold(successThreshold);
    this.halfOpenMaxConcurrent = this.createHalfOpenMaxConcurrent(
      halfOpenMaxConcurrent,
    );
  }

  private createFailureThreshold(
    value: number | CircuitBreakerFailureThreshold,
  ): CircuitBreakerFailureThreshold {
    try {
      return value instanceof CircuitBreakerFailureThreshold
        ? value
        : new CircuitBreakerFailureThreshold(value);
    } catch {
      throw new InvalidCircuitBreakerFailureThresholdError();
    }
  }

  private createSuccessThreshold(
    value: number | CircuitBreakerSuccessThreshold,
  ): CircuitBreakerSuccessThreshold {
    try {
      return value instanceof CircuitBreakerSuccessThreshold
        ? value
        : new CircuitBreakerSuccessThreshold(value);
    } catch {
      throw new InvalidCircuitBreakerSuccessThresholdError();
    }
  }

  private createRecoveryTimeout(
    value: number | Duration | CircuitBreakerRecoveryTimeout,
  ): CircuitBreakerRecoveryTimeout {
    try {
      return value instanceof CircuitBreakerRecoveryTimeout
        ? value
        : new CircuitBreakerRecoveryTimeout(value);
    } catch {
      throw new InvalidCircuitBreakerRecoveryTimeoutError();
    }
  }

  private createHalfOpenMaxConcurrent(
    value: number | Concurrency,
  ): Concurrency {
    try {
      return value instanceof Concurrency ? value : new Concurrency(value);
    } catch {
      throw new InvalidCircuitBreakerHalfOpenMaxConcurrentError();
    }
  }

  public getFailureThreshold(): CircuitBreakerFailureThreshold {
    return this.failureThreshold;
  }

  public getHalfOpenMaxConcurrent(): Concurrency {
    return this.halfOpenMaxConcurrent;
  }

  public getRecoveryTimeout(): CircuitBreakerRecoveryTimeout {
    return this.recoveryTimeout;
  }

  public getSuccessThreshold(): CircuitBreakerSuccessThreshold {
    return this.successThreshold;
  }
}
