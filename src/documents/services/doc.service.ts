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
import { GetNodeWithDocumentsResponse } from "./responses/node.doc.get";

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

    async getNodeWithDocuments(nodeId: string): Promise<GetNodeWithDocumentsResponse | null> {
        const nodeTitle = await this.documentRepository.getNodeTitle(nodeId);
        if (!nodeTitle) {
            return null;
        }

        const documents = await this.documentRepository.getDocumentsByNodeId(nodeId);

        const documentResponses = await Promise.all(
            documents.map(async doc => {
                if (doc.fillFiles) {
                    await doc.fillFiles(fileId => this.fileService.getFileInfo(fileId));
                }

                return {
                    id: doc.id,
                    title: doc.title,
                    description: doc.description,
                    tags: doc.tags,
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt,
                    files: doc.files?.map(fileInfo => GetFileResponseFromDomain(fileInfo)) || []
                };
            })
        );

        return {
            nodeTitle: nodeTitle,
            documents: documentResponses
        };
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