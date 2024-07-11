interface Job<JobType, ResultType> {
  data: JobType;
  worker: () => Worker;
  callback: (output: ResultType | undefined) => void;
}

interface QueueItem<JobType, ResultType> {
  next: QueueItem<JobType, ResultType> | undefined;
  value: Job<JobType, ResultType>;
}

class Queue<JobType, ResultType> {
  head: QueueItem<JobType, ResultType> | undefined;
  tail: QueueItem<JobType, ResultType> | undefined;

  constructor() {}

  enqueue(value: Job<JobType, ResultType>) {
    const link = { value, next: undefined };

    if (this.tail) this.tail.next = link;
    this.tail = link;

    if (!this.head) this.head = link;
  }

  dequeue() {
    if (this.head) {
      const value = this.head.value;
      this.head = this.head.next;
      return value;
    }
  }

  peek() {
    return this.head?.value;
  }
}

export class WorkerPool<InputType, ResultType> {
  private running = 0;
  queue: Queue<InputType, ResultType>;

  constructor(private poolsize: number) {
    this.running;
    this.queue = new Queue<InputType, ResultType>();
  }

  process(
    data: InputType,
    callback: (output: ResultType | undefined) => void,
    worker: () => Worker,
  ) {
    this.queue.enqueue({
      data: data,
      worker: worker,
      callback: callback,
    });

    this.submit();
  }

  private spawnWorker(job: Job<InputType, ResultType>) {
    const worker = job.worker();
    worker.onmessage = (message) => {
      job.callback(message.data);
      worker.terminate();
      this.running--;
      this.submit();
    };
    worker.onerror = (error) => {
      console.error(error);
      worker.terminate();
      this.running--;
      job.callback(undefined);
      this.submit();
    };
    worker.postMessage(job.data);
  }

  submit() {
    if (this.running < this.poolsize) {
      const job = this.queue.dequeue();
      if (job) {
        this.running++;
        this.spawnWorker(job);
      }
    }
  }
}
