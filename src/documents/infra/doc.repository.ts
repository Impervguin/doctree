import { DataSource, IsNull } from "typeorm";
import { Document } from "../domain/doc.model";
import { DocumentEntity, DocumentTagEntity } from "./doc.entity";
import { DocumentMapper } from "./doc.mapper";
import { Injectable } from "@nestjs/common";
import { NodeEntity } from "./doc.entity";


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
            relations: ['tags', 'documentFiles', 'documentNodes']
        }).then(entity => entity ? DocumentMapper.toDomain(entity) : null);
    }

    async getNodeTitle(nodeId: string): Promise<string | null> {
        let repo = this.dataSource.getRepository(NodeEntity);

        return repo.findOne({
            where: { id: nodeId }
        }).then(entity => entity ? entity.title : null);
    }

    async getDocumentsByNodeId(nodeId: string): Promise<Document[]> {
        const repo = this.dataSource.getRepository(DocumentEntity);
    
        const documentEntities = await repo.find({
            where: {
                documentNodes: {
                    nodeId: nodeId,
                    deletedAt: IsNull()
                },
                deletedAt: IsNull()
            },
            relations: [
                'tags',
                'documentFiles',
                'documentNodes'
            ]
        });

        return documentEntities.map(entity => DocumentMapper.toDomain(entity));
    }

    async updateDocument(doc: Document): Promise<void> {
        const repo = this.dataSource.getRepository(DocumentEntity);
        const tagRepo = this.dataSource.getRepository(DocumentTagEntity);

        try {
            await tagRepo.delete({ documentId: doc.id });
            const entity = DocumentMapper.toEntity(doc);
            entity.tags?.forEach(tag => {
                tag.documentId = doc.id;
                tag.document = entity;
            });

            await repo.save(entity);
        } catch (err) {
            throw err;
        }
    }

    async softDeleteDocument(docId: string): Promise<void> {
        let repo = this.dataSource.getRepository(DocumentEntity);

        return new Promise((resolve, reject) => {
            repo.createQueryBuilder().softDelete()
                .where('id = :id', { id: docId })
                .execute().then(_ => resolve()).catch(reject);
        });
    }
}