import { GetFileResponse } from "src/file/services/responses/get.file";


export interface GetDocumentResponse {
    id: string;
    title: string;
    description: string | null;
    tags: string[];
    files: GetFileResponse[];
}