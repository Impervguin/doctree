import { DataSource } from "typeorm";
import { Document } from "../domain/doc.model";
import { DocumentEntity } from "./doc.entity";
import { DocumentMapper } from "./doc.mapper";
import { Injectable } from "@nestjs/common";


@Injectable()
export class DocumentRepository {
    constructor(private dataSource: DataSource) {}
 
    async createDocument(doc: Document): Promise<void> {
        let repo = this.dataSource.getRepository(DocumentEntity);

        return new Promise((resolve, reject) => {
            repo.save(DocumentMapper.toEntity(doc)).then(_ => resolve()).catch(reject);
        });
    }

    async getDocument(docId: string): Promise<Document | null> {
        let repo = this.dataSource.getRepository(DocumentEntity);

        return repo.findOne({
            where: { id: docId },
            relations: ['tags', 'documentFiles']
        }).then(entity => entity ? DocumentMapper.toDomain(entity) : null);
    }

    async updateDocument(doc: Document): Promise<void> {
        let repo = this.dataSource.getRepository(DocumentEntity);

        return new Promise((resolve, reject) => {
            repo.save(DocumentMapper.toEntity(doc)).then(_ => resolve()).catch(reject);
        });
    }
}