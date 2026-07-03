export class FlowPipeline {
  private readonly controllers: Array<{
    run<T>(task: () => Promise<T> | T): Promise<T>;
  }> = [];

  public through(controller: {
    run<T>(task: () => Promise<T> | T): Promise<T>;
  }): FlowPipeline {
    this.controllers.push(controller);

    return this;
  }

  public run<T>(task: () => Promise<T> | T): Promise<T> {
    let wrappedTask = task;

    for (const controller of [...this.controllers].reverse()) {
      const currentTask = wrappedTask;

      wrappedTask = () => controller.run(currentTask);
    }

    return Promise.resolve(wrappedTask());
  }
}
