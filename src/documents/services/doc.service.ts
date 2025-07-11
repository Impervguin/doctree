import { Injectable } from "@nestjs/common";
import { DocumentRepository } from "../infra/doc.repository";
import { DocumentCreateRequest } from "./requests/doc.create";
import { Document } from "../domain/doc.model";
import { GetFileResponse } from "src/file/services/responses/get.file";
import { GetDocumentResponse } from "./responses/doc.get";
import { UploadFileService } from "src/file/services/upload.service";
import { GetFileResponseFromDomain } from "src/file/services/responses/get.file";
import { DocumentFileLinkRequest } from "./requests/doc.link";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocumentService {
    private readonly bucketName;
    constructor(
        private documentRepository: DocumentRepository, 
        private fileService: UploadFileService,
        private configService: ConfigService
    ) {
        this.bucketName = this.configService.getOrThrow('MINIO_BUCKET_NAME');
    }

    async createDocument(req : DocumentCreateRequest): Promise<void> {
        let doc = new Document(req.title, req.description !== undefined ? req.description : null, req.tags, []);
        return this.documentRepository.createDocument(doc);
    }

    async getDocument(docId: string): Promise<GetDocumentResponse | null> {
        return this.documentRepository.getDocument(docId).then(doc => {
            if (doc === null) {
                return null;
            }
            return doc.fillFiles(fileId => this.fileService.getFileInfo(fileId)).then(
                _ => {
                    return {
                        id: doc.id,
                        title: doc.title,
                        description: doc.description,
                        tags: doc.tags,
                        files: doc.files!.map(fileInfo => GetFileResponseFromDomain(fileInfo))
                    };
                }

            );
        });
    }

    async linkFile(req: DocumentFileLinkRequest): Promise<void> {
        return new Promise<void>( (resolve, reject) => {
            this.documentRepository.getDocument(req.documentId).then(
                doc => {
                    if (doc === null) {
                        reject(new Error("Document not found"));
                    }
                    const fileInfo = this.fileService.uploadFile({
                        filebucket: this.bucketName,
                        file: req.file,
                        filedir: doc!.id
                    }).then(fileInfo => {
                        doc!.addFileId(fileInfo.id);
                        this.documentRepository.updateDocument(doc!).then(resolve).catch(reject);
                    }).catch(reject);
                }
            )
        });
    }
}