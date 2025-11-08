import { Document } from "../domain/doc.model";
import { DocumentSearchRequest } from "../services/requests/doc.search";


export abstract class DocumentRepository {
    abstract createDocument(doc: Document): Promise<void>;
    abstract getDocument(docId: string): Promise<Document | null>;
    abstract getNodeTitle(nodeId: string): Promise<string | null>;
    abstract getDocumentsByNodeId(nodeId: string): Promise<Document[]>;
    abstract updateDocument(doc: Document): Promise<void>;
    abstract softDeleteDocument(docId: string): Promise<void>;
    abstract searchDocuments(query: DocumentSearchRequest): Promise<Document[]>;
}