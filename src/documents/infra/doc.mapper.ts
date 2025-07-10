import { Document } from "../domain/doc.model";
import { DocumentEntity, DocumentTagEntity, DocumentFileEntity } from "./doc.entity";

export class DocumentMapper {
    static toDomain(entity: DocumentEntity): Document {
        console.log(entity);
        return new Document(
            entity.title,
            entity.description,
            entity.tags.map(tag => tag.tag),
            entity.documentFiles !== undefined ? entity.documentFiles.map(file => file.fileId) : []
        );
    }
    static toEntity(document: Document): DocumentEntity {
        let entity = new DocumentEntity();
        entity.title = document.title;
        entity.description = document.description;
        entity.id = document.id;
        entity.createdAt = document.createdAt;
        entity.updatedAt = document.updatedAt;
        entity.deletedAt = document.deletedAt;
        entity.tags = document.tags.map(tag => {
            return {
                tag: tag,
                document: entity
            }
        });
        if (document.files) {
            entity.documentFiles = document.files.map(file => {
                return {
                    fileId: file.id,
                    document: entity,
                }
            });
        } else {
            entity.documentFiles = undefined;
        }
        return entity;

    }
}