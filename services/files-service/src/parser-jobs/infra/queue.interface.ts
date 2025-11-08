

export abstract class FileQueueRepo {
    abstract enqueue(fileId: string): Promise<void>;
    abstract worker(workFn: (fileId: string) => Promise<void>): Promise<void>;
    abstract dequeue(fileId: string): Promise<void>;
}