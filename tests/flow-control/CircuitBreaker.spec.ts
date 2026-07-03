import {
  CircuitBreaker,
  CircuitBreakerOpenError,
  CircuitBreakerOptions,
  CircuitBreakerState,
} from '../../src';

describe(CircuitBreaker.name, () => {
  it('opens after the configured failure threshold', async () => {
    const circuitBreaker = new CircuitBreaker(new CircuitBreakerOptions(2, 10));

    await expect(
      circuitBreaker.execute(async () => {
        throw new Error('first');
      }),
    ).rejects.toThrow('first');

    await expect(
      circuitBreaker.execute(async () => {
        throw new Error('second');
      }),
    ).rejects.toThrow('second');

    expect(circuitBreaker.getState().isOpen()).toBe(true);
    await expect(circuitBreaker.execute(() => 'value')).rejects.toThrow(
      CircuitBreakerOpenError,
    );
  });

  it('moves through half-open and closes after a successful probe', async () => {
    const circuitBreaker = new CircuitBreaker(new CircuitBreakerOptions(1, 1));

    await expect(
      circuitBreaker.execute(async () => {
        throw new Error('failure');
      }),
    ).rejects.toThrow('failure');

    await new Promise((resolve) => {
      setTimeout(resolve, 5);
    });

    expect(circuitBreaker.getState().isHalfOpen()).toBe(true);
    await expect(circuitBreaker.execute(() => 'ok')).resolves.toBe('ok');
    expect(circuitBreaker.getState().isClosed()).toBe(true);
  });

  it('resets failure count after a closed-state success', async () => {
    const circuitBreaker = new CircuitBreaker(new CircuitBreakerOptions(2, 10));

    await expect(
      circuitBreaker.execute(async () => {
        throw new Error('failure');
      }),
    ).rejects.toThrow('failure');

    await expect(circuitBreaker.execute(() => 'ok')).resolves.toBe('ok');

    expect(circuitBreaker.getFailureCount()).toBe(0);
  });

  it('limits half-open concurrent probes', async () => {
    const circuitBreaker = new CircuitBreaker(
      new CircuitBreakerOptions(1, 1, 2, 1),
    );
    let resolveProbe = (): void => undefined;

    await expect(
      circuitBreaker.execute(async () => {
        throw new Error('failure');
      }),
    ).rejects.toThrow('failure');

    await new Promise((resolve) => {
      setTimeout(resolve, 5);
    });

    const probe = circuitBreaker.execute(
      () =>
        new Promise<string>((resolve) => {
          resolveProbe = () => resolve('ok');
        }),
    );

    expect(circuitBreaker.getState().isHalfOpen()).toBe(true);
    await expect(circuitBreaker.execute(() => 'blocked')).rejects.toThrow(
      CircuitBreakerOpenError,
    );

    resolveProbe();
    await expect(probe).resolves.toBe('ok');
  });

  it('reopens when a half-open probe fails', async () => {
    const circuitBreaker = new CircuitBreaker(new CircuitBreakerOptions(1, 20));

    await expect(
      circuitBreaker.execute(async () => {
        throw new Error('initial failure');
      }),
    ).rejects.toThrow('initial failure');

    await new Promise((resolve) => {
      setTimeout(resolve, 25);
    });

    await expect(
      circuitBreaker.execute(async () => {
        throw new Error('probe failure');
      }),
    ).rejects.toThrow('probe failure');

    expect(circuitBreaker.getState().isOpen()).toBe(true);
  });

  it('can be reset explicitly', async () => {
    const circuitBreaker = new CircuitBreaker(new CircuitBreakerOptions(1, 10));

    await expect(
      circuitBreaker.execute(async () => {
        throw new Error('failure');
      }),
    ).rejects.toThrow('failure');

    circuitBreaker.reset();

    expect(circuitBreaker.getState().isClosed()).toBe(true);
    expect(circuitBreaker.getFailureCount()).toBe(0);
  });

  it('hydrates circuit breaker states from primitives', () => {
    expect(CircuitBreakerState.fromPrimitives('open').isOpen()).toBe(true);
    expect(CircuitBreakerState.CLOSED.open().isOpen()).toBe(true);
    expect(CircuitBreakerState.OPEN.halfOpen().isHalfOpen()).toBe(true);
    expect(CircuitBreakerState.HALF_OPEN.close().isClosed()).toBe(true);
  });
});
