---
title: Racer
description: Racer API reference.
---

# `Racer`

Runs several candidates and resolves with the first successful value.

## Import

```typescript
import { Racer } from '@haskou/flow';
```

## Methods

| Method | Description |
| --- | --- |
| `task(task)` | Adds a candidate task. |
| `add(task)` | Alias for `task(task)`. |
| `run(signal?)` | Runs candidates and resolves with the first success. |

## Example

```typescript
const user = await new Racer<User>()
  .task(() => getUserFromReplicaA(id))
  .task(() => getUserFromReplicaB(id))
  .run();
```

## With retry

```typescript
const user = await new Flow()
  .race(racer)
  .retry({ attempts: 2 })
  .run();
```

## Throws

- `RacerExhaustedError`
- any successful task value is returned before candidate failures are exposed

## Related

- [Flow](/reference/flow)
- [Retrier](/reference/retrier)
