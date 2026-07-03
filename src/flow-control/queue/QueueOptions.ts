import { InvalidQueueConcurrencyError } from '../../errors/InvalidQueueConcurrencyError';
import { Concurrency } from '../value-objects/Concurrency';

export class QueueOptions {
  private readonly concurrency: Concurrency;

  public static withConcurrency(
    concurrency: number | Concurrency,
  ): QueueOptions {
    return new QueueOptions(concurrency);
  }

  public constructor(concurrency: number | Concurrency = Concurrency.DEFAULT) {
    try {
      this.concurrency =
        concurrency instanceof Concurrency
          ? concurrency
          : new Concurrency(concurrency);
    } catch {
      throw new InvalidQueueConcurrencyError();
    }
  }

  public getConcurrency(): Concurrency {
    return this.concurrency;
  }
}
