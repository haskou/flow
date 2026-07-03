import { Timestamp } from '@haskou/value-objects';

import { CircuitBreakerOpenError } from '../../errors/CircuitBreakerOpenError';
import { CircuitBreakerFailureCount } from '../value-objects/CircuitBreakerFailureCount';
import { CircuitBreakerFailureThreshold } from '../value-objects/CircuitBreakerFailureThreshold';
import { CircuitBreakerOpenedAt } from '../value-objects/CircuitBreakerOpenedAt';
import { CircuitBreakerProbeCount } from '../value-objects/CircuitBreakerProbeCount';
import { CircuitBreakerRecoveryTimeout } from '../value-objects/CircuitBreakerRecoveryTimeout';
import { CircuitBreakerSuccessCount } from '../value-objects/CircuitBreakerSuccessCount';
import { CircuitBreakerSuccessThreshold } from '../value-objects/CircuitBreakerSuccessThreshold';
import { Concurrency } from '../value-objects/Concurrency';
import { CircuitBreakerOptions } from './CircuitBreakerOptions';
import { CircuitBreakerState } from './CircuitBreakerState';

export class CircuitBreaker {
  private readonly failureThreshold: CircuitBreakerFailureThreshold;
  private readonly halfOpenMaxConcurrent: Concurrency;
  private readonly recoveryTimeout: CircuitBreakerRecoveryTimeout;
  private readonly successThreshold: CircuitBreakerSuccessThreshold;
  private failureCount = CircuitBreakerFailureCount.ZERO;
  private halfOpenActiveCount = CircuitBreakerProbeCount.ZERO;
  private openedAt = CircuitBreakerOpenedAt.closed();
  private state = CircuitBreakerState.CLOSED;
  private successCount = CircuitBreakerSuccessCount.ZERO;

  public constructor(options: CircuitBreakerOptions) {
    this.failureThreshold = options.getFailureThreshold();
    this.recoveryTimeout = options.getRecoveryTimeout();
    this.successThreshold = options.getSuccessThreshold();
    this.halfOpenMaxConcurrent = options.getHalfOpenMaxConcurrent();
  }

  private beforeExecution(): void {
    this.moveToHalfOpenWhenReady();

    if (this.state.isOpen()) {
      throw new CircuitBreakerOpenError();
    }

    if (this.state.isHalfOpen()) {
      if (!this.halfOpenActiveCount.isAllowedBy(this.halfOpenMaxConcurrent)) {
        throw new CircuitBreakerOpenError();
      }

      this.halfOpenActiveCount = this.halfOpenActiveCount.increment();
    }
  }

  private recordSuccess(): void {
    if (this.state.isHalfOpen()) {
      this.successCount = this.successCount.increment();

      if (this.successCount.hasReached(this.successThreshold)) {
        this.reset();
      }

      return;
    }

    this.failureCount = CircuitBreakerFailureCount.ZERO;
  }

  private recordFailure(): void {
    this.failureCount = this.failureCount.increment();
    this.successCount = CircuitBreakerSuccessCount.ZERO;

    if (
      this.failureCount.hasReached(this.failureThreshold) ||
      this.state.isHalfOpen()
    ) {
      this.open();
    }
  }

  private open(): void {
    this.state = this.state.open();
    this.openedAt = CircuitBreakerOpenedAt.now();
    this.halfOpenActiveCount = CircuitBreakerProbeCount.ZERO;
  }

  private moveToHalfOpenWhenReady(): void {
    if (!this.state.isOpen()) {
      return;
    }

    if (
      !this.openedAt.hasRecoveryElapsed(this.recoveryTimeout, Timestamp.now())
    ) {
      return;
    }

    this.state = this.state.halfOpen();
    this.successCount = CircuitBreakerSuccessCount.ZERO;
    this.halfOpenActiveCount = CircuitBreakerProbeCount.ZERO;
  }

  public getState(): CircuitBreakerState {
    this.moveToHalfOpenWhenReady();

    return this.state;
  }

  public getFailureCount(): number {
    return this.failureCount.valueOf();
  }

  public async execute<T>(task: () => Promise<T> | T): Promise<T> {
    this.beforeExecution();

    try {
      const result = await task();
      this.recordSuccess();

      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    } finally {
      if (this.state.isHalfOpen()) {
        this.halfOpenActiveCount = this.halfOpenActiveCount.decrement();
      }
    }
  }

  public run<T>(task: () => Promise<T> | T): Promise<T> {
    return this.execute(task);
  }

  public reset(): void {
    this.state = this.state.close();
    this.failureCount = CircuitBreakerFailureCount.ZERO;
    this.successCount = CircuitBreakerSuccessCount.ZERO;
    this.halfOpenActiveCount = CircuitBreakerProbeCount.ZERO;
    this.openedAt = CircuitBreakerOpenedAt.closed();
  }
}
