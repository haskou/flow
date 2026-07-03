import {
  Integer,
  NumberValueObject,
  PositiveNumber,
} from '@haskou/value-objects';

import { InvalidPositiveIntegerValueError } from '../../errors/InvalidPositiveIntegerValueError';

export abstract class PositiveIntegerValueObject extends NumberValueObject {
  private static ensurePositiveInteger(
    value: number | NumberValueObject,
  ): NumberValueObject {
    try {
      return new Integer(new PositiveNumber(value));
    } catch {
      throw new InvalidPositiveIntegerValueError();
    }
  }

  public constructor(value: number | NumberValueObject) {
    super(PositiveIntegerValueObject.ensurePositiveInteger(value));

    if (this.isZero()) {
      throw new InvalidPositiveIntegerValueError();
    }
  }
}
