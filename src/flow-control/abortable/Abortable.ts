import { FlowAbortedError } from '../../errors/FlowAbortedError';
import { FlowTask } from '../flow/FlowTask';

export class Abortable {
  private readonly controller = new AbortController();

  public abort(): void {
    this.controller.abort();
  }

  public getSignal(): AbortSignal {
    return this.controller.signal;
  }

  public run<T>(
    task: FlowTask<T> | ((signal: AbortSignal) => Promise<T> | T),
  ): Promise<T> {
    const flowTask = task instanceof FlowTask ? task : new FlowTask(task);

    if (this.controller.signal.aborted) {
      return Promise.reject(new FlowAbortedError());
    }

    const aborted = new Promise<T>((_, reject) => {
      this.controller.signal.addEventListener('abort', () => {
        reject(new FlowAbortedError());
      });
    });

    return Promise.race([flowTask.run(this.controller.signal), aborted]);
  }
}
