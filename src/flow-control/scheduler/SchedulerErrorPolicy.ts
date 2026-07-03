import { Enum } from '@haskou/value-objects';

const schedulerErrorPolicyValues = {
  SWALLOW: 'swallow',
  THROW: 'throw',
};

export class SchedulerErrorPolicy extends Enum<string> {
  public static readonly THROW = new SchedulerErrorPolicy(
    schedulerErrorPolicyValues.THROW,
  );

  public static readonly SWALLOW = new SchedulerErrorPolicy(
    schedulerErrorPolicyValues.SWALLOW,
  );

  public static fromPrimitives(value: string): SchedulerErrorPolicy {
    return new SchedulerErrorPolicy(value);
  }

  private constructor(value: string) {
    super(value);
  }

  public getValues(): string[] {
    return Object.values(schedulerErrorPolicyValues);
  }

  public isThrow(): boolean {
    return this.isEqual(SchedulerErrorPolicy.THROW);
  }

  public isSwallow(): boolean {
    return this.isEqual(SchedulerErrorPolicy.SWALLOW);
  }
}
