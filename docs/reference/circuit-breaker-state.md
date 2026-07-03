---
title: CircuitBreakerState
description: CircuitBreakerState API reference.
---

# `CircuitBreakerState`

Enum-style value object for circuit breaker state.

Use `isClosed()`, `isOpen()`, and `isHalfOpen()` when checking state. Callers should not compare raw strings such as `'open'`.

## Import

```typescript
import { CircuitBreakerState } from '@haskou/flow';
```

## Signature

```typescript
class CircuitBreakerState extends Enum<string>
```

## Values

| Value | Primitive |
| --- | --- |
| `CircuitBreakerState.CLOSED` | `'closed'` |
| `CircuitBreakerState.OPEN` | `'open'` |
| `CircuitBreakerState.HALF_OPEN` | `'half-open'` |

## Factories

| Method | Description |
| --- | --- |
| `fromPrimitives(value)` | Hydrates a state from a primitive string. |

## Methods

| Method | Description |
| --- | --- |
| `getValues()` | Returns allowed primitive values. |
| `isClosed()` | Returns true for `CLOSED`. |
| `isOpen()` | Returns true for `OPEN`. |
| `isHalfOpen()` | Returns true for `HALF_OPEN`. |
| `open()` | Returns `CircuitBreakerState.OPEN`. |
| `halfOpen()` | Returns `CircuitBreakerState.HALF_OPEN`. |
| `close()` | Returns `CircuitBreakerState.CLOSED`. |

## Example

```typescript
const state = CircuitBreakerState.fromPrimitives('open');

state.isOpen(); // true
state.close().isClosed(); // true
```

## Notes

- Use `isOpen()`, `isClosed()`, and `isHalfOpen()` for decisions.
- `fromPrimitives()` is intended for boundaries and hydration.
- `CircuitBreaker` owns state transitions during execution.

## Related

- [CircuitBreaker](/reference/circuit-breaker)
- [Errors](/reference/errors)
