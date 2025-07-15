import { GetFileResponse } from "src/file/services/responses/get.file";


export interface GetDocumentRelationResponse {
    documentId: string;
    type: string;
}

export interface GetDocumentResponse {
    id: string;
    title: string;
    description: string | null;
    tags: string[];
    files: GetFileResponse[];
    relations: GetDocumentRelationResponse[];
}