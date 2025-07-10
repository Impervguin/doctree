import { Injectable } from "@nestjs/common";
import { DocumentRepository } from "../infra/doc.repository";
import { DocumentCreateRequest } from "./requests/doc.create";
import { Document } from "../domain/doc.model";
import { GetFileResponse } from "src/file/services/responses/get.file";
import { GetDocumentResponse } from "./responses/doc.get";
import { UploadFileService } from "src/file/services/upload.service";
import { GetFileResponseFromDomain } from "src/file/services/responses/get.file";

@Injectable()
export class DocumentService {
    constructor(private documentRepository: DocumentRepository, private fileService: UploadFileService) {}

    async createDocument(req : DocumentCreateRequest): Promise<void> {
        let doc = new Document(req.title, req.description !== undefined ? req.description : null, req.tags, []);
        return this.documentRepository.createDocument(doc);
    }

    async getDocument(docId: string): Promise<GetDocumentResponse | null> {
        return this.documentRepository.getDocument(docId).then(doc => {
            if (doc === null) {
                return null;
            }

            doc.fillFiles(fileId => this.fileService.getFileInfo(fileId));

            return {
                id: doc.id,
                title: doc.title,
                description: doc.description,
                tags: doc.tags,
                files: doc.files!.map(fileInfo => GetFileResponseFromDomain(fileInfo))
            };
        });
    }
}