import { IsArray, IsOptional, IsString } from 'class-validator';
import { BaseModel } from '../../base/base.model';
import { ValidateObject } from 'src/utils/validate.throw';
import { StoredFileInfo } from 'src/file/domain/meta.domain';

export class Document extends BaseModel {

    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string | null;

    @IsOptional()
    @IsArray()
    tags: string[];

    @IsArray()
    fileIds: string[];

    @IsOptional()
    @IsArray()
    files?: StoredFileInfo[];

    @IsArray()
    nodeIds: string[];

    constructor(title: string, description: string | null, tags: string[], fileIds: string[], nodeIds: string[]);
    constructor(title: string, description: string | null, tags: string[], fileIds: string[], nodeIds: string[], id: string, createdAt: Date, updatedAt: Date, deletedAt: Date | null);
    constructor(title: string, description: string  | null, tags: string[], fileIds: string[], nodeIds: string[], id?: string, createdAt?: Date, updatedAt?: Date, deletedAt?: Date | null) {
        if (arguments.length <= 4) {
            super();
        } else {
            super(id!, createdAt!, updatedAt!, deletedAt!);
        }
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.fileIds = fileIds;
        this.nodeIds = nodeIds;

        ValidateObject(this);
    }

    fillFiles(fileFunc: (fileId: string) => Promise<StoredFileInfo | null>): Promise<void> {
        if (this.files !== undefined) {
            throw new Error("Files already filled");
        }
        this.files = [];
        return Promise.all(this.fileIds.map(fileId => fileFunc(fileId).then(fileInfo => {
            if (fileInfo === null) {
                throw new Error("File not found");
            }
            this.files!.push(fileInfo);
        }))).then(_ => undefined);
    }

    addFileId(fileId: string): void {
        if (this.files !== undefined) {
            throw new Error("Files already filled, can't add just file id");
        }
        this.fileIds.push(fileId);
    }

    attachToNode(nodeId: string): void {
        if (this.nodeIds.includes(nodeId)) {
            throw new Error("Node already attached");
        }
        this.nodeIds.push(nodeId);
    }

    detachFromNode(nodeId: string): void {
        this.nodeIds = this.nodeIds.filter(id => id !== nodeId);
    }
}