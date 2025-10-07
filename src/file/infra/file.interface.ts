import { BufferedFile } from "../domain/bufferedfile.domain";

export abstract class FileRepository {
    abstract listBuckets(): Promise<string[]>;
    abstract putObject(bucketName: string, key: string, file: BufferedFile): Promise<void>;
    abstract deleteObject(bucketName: string, objectName: string): Promise<void>;
    abstract getUrl(bucketName: string, objectName: string): Promise<string>;
    abstract loadObject(bucketName: string, objectName: string): Promise<Buffer>;
}