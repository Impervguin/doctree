import { DocumentDto, DocumentNodeDto, DocumentRelationDto } from "./doc.get";
import { Document, DocumentRelation, Node } from "../../domain/doc.model";
import { GetFileResponseFromDomain } from "src/file/services/responses/get.file";
import { NodeDocument, NodeWithDocumentsResponse } from "src/documents/services/responses/get.node";
import { NodeDocumentDto, NodeWithDocumentsResponseDto } from "./node.doc.get";


export class DocumentRelationMapper {
    static toDto(relation: DocumentRelation): DocumentRelationDto {
        return {
            documentId: relation.documentId,
            type: relation.type
        }
    }
}

export class DocumentNodeMapper {
    static toDto(node: Node): DocumentNodeDto {
        return {
            id: node.id,
            title: node.title,
        };
    }
}

export class DocumentMapper {
    static toDto(doc: Document): DocumentDto {

        return {
            id: doc.id,
            title: doc.title,
            description: doc.description,
            tags: doc.tags,
            files: doc.files ? doc.files.map(fileInfo => GetFileResponseFromDomain(fileInfo)) : [],
            nodes: doc.nodes ? doc.nodes.map(node => DocumentNodeMapper.toDto(node)) : [],
            relations: doc.relations.map(relation => DocumentRelationMapper.toDto(relation))
        };
    }
}

export class NodeDocumentMapper {
    static toDto(doc: NodeDocument): NodeDocumentDto {
        return {
            id: doc.id,
            title: doc.title,
            description: doc.description,
            tags: doc.tags,
            files: doc.files ? doc.files : []
        };
    }
}

export class NodeWithDocumentMapper {
    static toDto(node: NodeWithDocumentsResponse): NodeWithDocumentsResponseDto {
        return {
            nodeTitle: node.nodeTitle,
            documents: node.documents.map(doc => NodeDocumentMapper.toDto(doc))
        };
    }
}
