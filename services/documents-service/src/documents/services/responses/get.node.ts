import { StoredFileInfo } from "src/documents/domain/file.model";


export class NodeWithDocumentsResponse {
    nodeTitle: string;
    documents: NodeDocument[];
}

export class NodeDocument {
    id: string;
    title: string;
    description: string | null;
    tags: string[];
    files: StoredFileInfo[];
}