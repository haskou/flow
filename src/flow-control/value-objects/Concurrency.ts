import { NumberValueObject } from '@haskou/value-objects';

import { PositiveIntegerValueObject } from './PositiveIntegerValueObject';

export class Concurrency extends PositiveIntegerValueObject {
  public static readonly DEFAULT = new Concurrency(1);

  public constructor(value: number | NumberValueObject) {
    super(value);
  }

  public allows(activeCount: NumberValueObject): boolean {
    return activeCount.isLessThan(this);
  }
}
