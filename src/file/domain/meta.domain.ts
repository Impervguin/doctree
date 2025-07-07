import { BaseModel } from "src/base/base.model";

export class StoredFileMetaInfo extends BaseModel {
    title: string;
    description: string;

    filesrc?: string;

    constructor(title: string, description: string);
    constructor(title: string, description: string, filesrc: string);
    constructor(title: string, description: string, filesrc: string, id: string, createdAt: Date, updatedAt: Date, deletedAt: Date | null);
    constructor(title: string, description: string, filesrc?: string, id?: string, createdAt?: Date, updatedAt?: Date, deletedAt?: Date | null) {
        if (arguments.length <= 2) {
            super();
        } else {
            super(id!, createdAt!, updatedAt!, deletedAt!);
        }
        this.title = title;
        this.description = description;
        this.filesrc = filesrc;
    }
}

