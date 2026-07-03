import { FlowError } from './FlowError';

export class RacerExhaustedError extends FlowError {
  private static readonly MESSAGE = 'Racer exhausted all candidates';

  public constructor() {
    super(RacerExhaustedError.MESSAGE);
  }
}
