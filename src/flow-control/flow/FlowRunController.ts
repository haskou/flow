import { FlowTask } from './FlowTask';

export class FlowRunController {
  public constructor(
    private readonly controller: {
      run<T>(task: () => Promise<T> | T): Promise<T>;
    },
  ) {}

  public run<T>(task: FlowTask<T>, signal: AbortSignal): Promise<T> {
    return this.controller.run(() => task.run(signal));
  }
}
