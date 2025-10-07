import { StoredFileInfo } from "../domain/meta.domain";

export abstract class FileInfoRepository {
    abstract save(fileInfo: StoredFileInfo): Promise<void>;
    abstract hardDelete(fileId: string): Promise<void>;
    abstract get(fileId: string): Promise<StoredFileInfo | null>;
    abstract softDelete(fileId: string): Promise<void>;
}