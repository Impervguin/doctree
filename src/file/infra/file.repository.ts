import { Injectable } from '@nestjs/common';
import { MinioClient } from 'src/minio/client/client';

@Injectable()
export class FileRepository {
    constructor(private minioClient: MinioClient) {}

    async listBuckets(): Promise<string[]> {
        return this.minioClient.listBuckets().then(buckets => buckets.map(bucket => bucket.name));
    }
}