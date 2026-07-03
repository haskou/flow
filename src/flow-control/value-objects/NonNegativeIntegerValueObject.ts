import { Integer, NumberValueObject } from '@haskou/value-objects';

import { InvalidFlowCountError } from '../../errors/InvalidFlowCountError';

export abstract class NonNegativeIntegerValueObject extends NumberValueObject {
  public constructor(value: number | NumberValueObject) {
    super(new Integer(value));

    if (this.isLessThan(0)) {
      throw new InvalidFlowCountError();
    }
  }
}
