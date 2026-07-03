import { SemaphoreReleasedError } from '../../errors/SemaphoreReleasedError';

export class SemaphorePermit {
  private released = false;

  public constructor(private readonly releaseCallback: () => void) {}

  public release(): void {
    if (this.released) {
      throw new SemaphoreReleasedError();
    }

    this.released = true;
    this.releaseCallback();
  }
}
