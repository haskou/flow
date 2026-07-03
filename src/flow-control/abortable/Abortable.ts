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

    return new Promise<T>((resolve, reject) => {
      const abort = (): void => {
        this.controller.signal.removeEventListener('abort', abort);
        reject(new FlowAbortedError());
      };
      const cleanup = (): void => {
        this.controller.signal.removeEventListener('abort', abort);
      };

      this.controller.signal.addEventListener('abort', abort);

      flowTask
        .run(this.controller.signal)
        .then(resolve)
        .catch(reject)
        .finally(cleanup);
    });
  }
}
