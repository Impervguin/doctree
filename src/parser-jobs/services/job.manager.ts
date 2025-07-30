import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { Worker, MessageChannel, MessagePort } from 'worker_threads';
import { FileQueueRepo } from "../infra/queue.repo";
import { join } from "path";
import { ParseFileResponse } from "../../text-parser/services/responses/parse.response";
import { ParseService } from "../../text-parser/services/parse.service";


@Injectable()
export class ParsingJobManager {
    private readonly logger = new Logger(ParsingJobManager.name);
    private worker: Worker |  null = null;
    private workerPort: MessagePort | null = null;

    constructor(
        private readonly queueRepo: FileQueueRepo,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.startWorker();
        await this.initQueue();
    }

    private async startWorker(): Promise<void> {
        if (this.worker !== null) {
            return;
        }

        const channel = new MessageChannel();
        this.workerPort = channel.port1;

        this.worker = new Worker(join(__dirname, 'workers/parsing.worker.js'), {
            workerData: {
                ports: [channel.port2],
            },
            transferList: [channel.port2],
        });

        await new Promise<void>((resolve, reject) => {
            this.worker?.once('message', (msg) => {
                if (msg === 'ready') {
                    resolve();
                } else {
                    reject(new Error(`Worker failed to start: ${msg}`));
                }
            }); 
        });
    }

    private async initQueue(): Promise<void> {
        await this.queueRepo.worker(async (fileId) => {
            const resp = await new Promise<ParseFileResponse>((resolve, reject) => {
                this.workerPort?.postMessage({fileId: fileId});
                this.workerPort?.once('message', (msg) => {
                    resolve(msg);
                });
                this.workerPort?.once('error', (err) => {
                    reject(err);
                });
            });
            console.log(resp);
        });
    }

    async enqueue(fileId: string): Promise<void> {
        await this.queueRepo.enqueue(fileId);
    }
}