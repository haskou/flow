---
title: Error handling
description: Error handling in @haskou/flow.
---

# Error handling

The library exposes specific error classes:

- `SemaphoreReleasedError` for double releases;
- `QueueClearedError` when pending queue work is cleared;
- `CircuitBreakerOpenError` when execution is rejected by an open breaker;
- `FlowCancelledError` when pending debounce work is cancelled.

Catch these classes when the caller can recover from the flow-control decision. Let unexpected task errors propagate.
