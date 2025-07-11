import { DataSource } from "typeorm";
import { Document } from "../domain/doc.model";
import { DocumentEntity } from "./doc.entity";
import { DocumentMapper } from "./doc.mapper";
import { Injectable } from "@nestjs/common";
import { NodeEntity } from "src/node/infra/node.entity";


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

    async getNodeTitle(nodeId: string): Promise<string | null> {
        let repo = this.dataSource.getRepository(NodeEntity);

        return repo.findOne({
            where: { id: nodeId }
        }).then(entity => entity ? entity.title : null);
    }

    // temp - WIP
    async getDocumentsByNodeId(nodeId: string): Promise<Document[]> {
        const repo = this.dataSource.getRepository(DocumentEntity);
        
        const documentEntities = await repo
            .createQueryBuilder('document')
            .innerJoin('documents_nodes', 'dn', 'dn.document_id = document.id')
            .leftJoinAndSelect('document.tags', 'tags')
            .leftJoinAndSelect('document.documentFiles', 'documentFiles')
            .where('dn.node_id = :nodeId', { nodeId })
            .andWhere('document.deleted_at IS NULL')
            .andWhere('dn.deleted_at IS NULL')
            .getMany();

        return documentEntities.map(entity => DocumentMapper.toDomain(entity));
    }

    async updateDocument(doc: Document): Promise<void> {
        let repo = this.dataSource.getRepository(DocumentEntity);

        return new Promise((resolve, reject) => {
            repo.save(DocumentMapper.toEntity(doc)).then(_ => resolve()).catch(reject);
        });
    }
}