import { Injectable } from '@nestjs/common';
import { MinioClient } from 'src/minio/client/client';

@Injectable()
export class FileRepository {
    constructor(private minioClient: MinioClient) {}

    async listBuckets(): Promise<string[]> {
        return this.minioClient.listBuckets().then(buckets => buckets.map(bucket => bucket.name));
    }

    async putObject(bucketName: string, file: Express.Multer.File): Promise<void> {
        await this.minioClient.putObject(
            bucketName,
            file.originalname,
            file.buffer,
            file.size,
        );
    }

    async getUrl(bucketName: string, objectName: string): Promise<string> {
        return this.minioClient.presignedUrl('GET', bucketName, objectName);
    }
}