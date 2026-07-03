import { Semaphore } from '../semaphore/Semaphore';
import { FlowTask } from './FlowTask';

export class FlowLimit {
  public constructor(private readonly semaphore: Semaphore) {}

  public run<T>(task: FlowTask<T>, signal: AbortSignal): Promise<T> {
    return this.semaphore.run(() => task.run(signal));
  }
}
