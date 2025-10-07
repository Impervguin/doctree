import { GetFileResponse } from "src/file/services/responses/get.file";


export class NodeWithDocumentsResponse {
    nodeTitle: string;
    documents: NodeDocument[];
}

export class NodeDocument {
    id: string;
    title: string;
    description: string | null;
    tags: string[];
    files: GetFileResponse[];
}