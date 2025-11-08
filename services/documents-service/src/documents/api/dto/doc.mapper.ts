import { DocumentDto, DocumentFileDto, DocumentNodeDto, DocumentRelationDto } from "./doc.get";
import { Document, DocumentRelation, Node } from "../../domain/doc.model";
import { NodeDocument, NodeWithDocumentsResponse } from "src/documents/services/responses/get.node";
import { NodeDocumentDto, NodeWithDocumentsResponseDto } from "./node.doc.get";
import { StoredFileInfo } from "src/documents/domain/file.model";


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

export class DocumentFileMapper {
    static toDto(fileInfo: StoredFileInfo): DocumentFileDto {
        return {
            id: fileInfo.id,
            title: fileInfo.title,
            description: fileInfo.description,
            fileUrl: fileInfo.filebucket + "/" + fileInfo.filekey
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
            files: doc.files ? doc.files.map(fileInfo => DocumentFileMapper.toDto(fileInfo)) : [],
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
            files: doc.files.map(fileInfo => DocumentFileMapper.toDto(fileInfo))
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
