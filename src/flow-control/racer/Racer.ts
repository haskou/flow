import { RacerExhaustedError } from '../../errors/RacerExhaustedError';
import { FlowTask } from '../flow/FlowTask';

export class Racer<T> {
  private readonly candidates: Array<FlowTask<T>> = [];

  public task(task: (signal: AbortSignal) => Promise<T> | T): Racer<T> {
    this.candidates.push(new FlowTask(task));

    return this;
  }

  public add(task: (signal: AbortSignal) => Promise<T> | T): Racer<T> {
    return this.task(task);
  }

  public run(signal: AbortSignal = new AbortController().signal): Promise<T> {
    if (!this.candidates.length) {
      return Promise.reject(new RacerExhaustedError());
    }

    const controller = new AbortController();

    signal.addEventListener('abort', () => {
      controller.abort();
    });

    return Promise.any(
      this.candidates.map((candidate) => candidate.run(controller.signal)),
    )
      .then((value) => {
        controller.abort();

        return value;
      })
      .catch(() => {
        throw new RacerExhaustedError();
      });
  }
}
