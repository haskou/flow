import { NumberValueObject } from '@haskou/value-objects';

import type { Concurrency } from './Concurrency';

import { NonNegativeIntegerValueObject } from './NonNegativeIntegerValueObject';

export class ActiveTaskCount extends NonNegativeIntegerValueObject {
  public static readonly ZERO = new ActiveTaskCount(0);

  public constructor(value: number | NumberValueObject) {
    super(value);
  }

  public increment(): ActiveTaskCount {
    return new ActiveTaskCount(this.add(1));
  }

  public decrement(): ActiveTaskCount {
    return new ActiveTaskCount(this.subtract(1));
  }

  public isAllowedBy(concurrency: Concurrency): boolean {
    return concurrency.allows(this);
  }
}
