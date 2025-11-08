import { Injectable } from "@nestjs/common";
import { DocumentRepository } from "../infra/interface.repository";
import { DocumentCreateRequest } from "./requests/doc.create";
import { Document } from "../domain/doc.model";
import { ConfigService } from '@nestjs/config';
import { NodeWithDocumentsResponse } from "./responses/get.node";
import { AttachDocumentToNodeRequest, DetachDocumentFromNodeRequest,
         DocumentFileLinkRequest, DocumentUnlinkFileRequest,
         RelateDocumentsRequest, UnrelateDocumentsRequest
} from "./requests/doc.link";
import { deserializeDate, formatDate, parseDate, serializeDate } from "@doctree/shared/utils/date";
import { DocumentUpdateRequest } from "./requests/doc.update";
import { DocumentSearchRequest } from "./requests/doc.search";
import { NodeNotFoundError } from "./errors.service"; // Assume local or shared
import { DocumentAlreadyAttachedError, DocumentNotAttachedError, DocumentNotFoundError, DocumentNotLinkedError, NoSelfreferenceError } from "./errors.service";
import { AttachDocumentToNodeResponse } from "./responses/attach.doc";
import { FileClient } from "../ports/services/file-client.service";
import { TreeClient } from "../ports/services/tree-client.service";
import { AuthClient } from "../ports/services/auth-client.service";
import { Tree } from "../domain/tree.model";
import { StoredFileInfo } from "../domain/file.model";

@Injectable()
export class DocumentService {
    private readonly bucketName;
    private static readonly dateFormat = "dd-MM-yyyyTHH:mm:ss";
    constructor(
        private documentRepository: DocumentRepository,
        private configService: ConfigService,
        private fileClient: FileClient,
        private treeClient: TreeClient,
        private authClient: AuthClient
    ) {
        this.bucketName = this.configService.getOrThrow('MINIO_BUCKET_NAME');
    }

    async createDocument(req : DocumentCreateRequest): Promise<Document> {
        let doc = new Document(req.title, req.description !== undefined ? req.description : null, req.tags, [], [], []);
        return this.documentRepository.createDocument(doc).then(_ => doc);
    }

    async getDocument(docId: string): Promise<Document> {
        const doc = await this.documentRepository.getDocument(docId);
        if (doc === null) {
            throw new DocumentNotFoundError('Document not found');
        }
        await doc.fillFiles(fileId => this.fileClient.getFileInfo(fileId).then(res => new StoredFileInfo(res.title, res.description ?? null, res.filebucket, res.filekey, res.id, deserializeDate(res.createdAt), deserializeDate(res.updatedAt), res.deletedAt ? deserializeDate(res.deletedAt) : null)));
        await doc.fillNodes(nodeId => this.treeClient.getNode(nodeId));
        return doc;
    }

    async getNodeWithDocuments(nodeId: string): Promise<NodeWithDocumentsResponse> {
        const nodeTitle = await this.documentRepository.getNodeTitle(nodeId);
        if (!nodeTitle) {
            throw new NodeNotFoundError('Node not found');
        }

        const documents = await this.documentRepository.getDocumentsByNodeId(nodeId);

        const documentResponses = await Promise.all(
            documents.map(async doc => {
                if (doc.fillFiles) {
                    await doc.fillFiles(fileId => this.fileClient.getFileInfo(fileId).then(res => new StoredFileInfo(res.title, res.description ?? null, res.filebucket, res.filekey, res.id, deserializeDate(res.createdAt), deserializeDate(res.updatedAt), res.deletedAt ? deserializeDate(res.deletedAt) : null)));
                }

                return {
                    id: doc.id,
                    title: doc.title,
                    description: doc.description,
                    tags: doc.tags,
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt,
                    files: doc.files || []
                };
            })
        );

        return {
            nodeTitle: nodeTitle,
            documents: documentResponses
        };
    }

    async linkFile(req: DocumentFileLinkRequest): Promise<void> {
        const doc = await this.documentRepository.getDocument(req.documentId);
        
        if (!doc) {
            throw new DocumentNotFoundError('Document not found');
        }

        const fileNameWithTimestamp = req.file.filename.replace(
            /(\.[^.]*)$/, 
            `_${formatDate(DocumentService.dateFormat, new Date())}$1`
        );

        const fileInfo = await this.fileClient.uploadFile({
            filebucket: this.bucketName,
            filename: fileNameWithTimestamp,
            buffer: req.file.buffer,
            size: req.file.size,
            filedir: doc.id
        });

        doc.addFileId(fileInfo.id);
        await this.documentRepository.updateDocument(doc);
    }

    async attachDocumentToNode(req: AttachDocumentToNodeRequest): Promise<AttachDocumentToNodeResponse> {
        let result: AttachDocumentToNodeResponse = {moved: false};
        return new Promise<AttachDocumentToNodeResponse>( (resolve, reject) => {
            this.documentRepository.getDocument(req.documentId).then(
                doc => {
                    if (doc === null) {
                        throw new DocumentNotFoundError("Document not found");
                    }
                    // get the tree to which the document will be attached
                    this.treeClient.getRootTree(req.nodeId).then(rootTree => {
                        
                        // check if the document is already attached to the node
                        let node: Tree | null = rootTree.find(node => doc!.nodeIds.includes(node.id));
                        // if the document is already attached to the node, and we don't want to move it, reject
                        if (node !== null && !req.move) {
                            reject(new DocumentAlreadyAttachedError("Document already attached to node"));
                        }
                        // both attached and not attached, it we want to move it, we need to detach it from the old nodes
                        // for now it must be only attached to one node, but still we do cycle check, just in case
                        while (node !== null) {
                            doc?.detachFromNode(node.id);
                            node = rootTree.find(node => doc!.nodeIds.includes(node.id));
                            result.moved = true;
                        }
                        // attach the document to the node
                        doc?.attachToNode(req.nodeId);
                        this.documentRepository.updateDocument(doc!).then(() => resolve(result)).catch(reject);
                    }).catch(reject);
                }).catch(reject);
        });
    }

    async detachDocumentFromNode(req: DetachDocumentFromNodeRequest): Promise<void> {
        return new Promise<void>( (resolve, reject) => {
            this.documentRepository.getDocument(req.documentId).then(
                doc => {
                    if (doc === null) {
                        throw new DocumentNotFoundError("Document not found");
                    }
                    if (!doc!.nodeIds.includes(req.nodeId)) {
                        reject(new DocumentNotAttachedError("Document not attached to node"));
                    }
                    doc!.detachFromNode(req.nodeId);
                    this.documentRepository.updateDocument(doc!).then(resolve).catch(reject);
                }).catch(reject);
        });
    }

    async unlinkFile(req: DocumentUnlinkFileRequest): Promise<void> {
        return new Promise<void>( (resolve, reject) => {
            this.documentRepository.getDocument(req.documentId).then(
                doc => {
                    if (doc === null) {
                        throw new DocumentNotFoundError("Document not found");
                    }
                    if (!doc!.fileIds.includes(req.fileId)) {
                        reject(new DocumentNotLinkedError("File not attached to document"));
                    }
                    doc!.removeFileId(req.fileId);
                    this.documentRepository.updateDocument(doc!).then(
                        _ => {
                            this.fileClient.deleteFile(req.fileId).then(resolve).catch(reject);
                        }
                    ).catch(reject);
                }).catch(reject);
        });
    }


    async updateDocument(docId: string, req: DocumentUpdateRequest): Promise<void> {
        return this.documentRepository.getDocument(docId).then(doc => {
            if (doc === null) {
                throw new DocumentNotFoundError("Document not found");
            }
            
            if (req.title !== undefined) {
                doc.title = req.title;
            }
            if (req.description !== undefined) {
                doc.description = req.description;
            }
            if (req.tags !== undefined) {
                doc.tags = req.tags;
            }

            this.documentRepository.updateDocument(doc).then();
        });
    }

    async deleteDocument(docId: string): Promise<void> {
        return this.documentRepository.softDeleteDocument(docId);
    }

    async relateDocuments(req: RelateDocumentsRequest): Promise<void> {
        return new Promise<void>( (resolve, reject) => {
            let doc1Promise = this.documentRepository.getDocument(req.documentId0);
            let doc2Promise = this.documentRepository.getDocument(req.documentId1);
            return Promise.all([doc1Promise, doc2Promise]).then(docs => {
                if (docs[0] === null) {
                    throw new DocumentNotFoundError("Document not found");
                }
                if (docs[1] === null) {
                    throw new DocumentNotFoundError("Document not found");
                }
                let doc0: Document = docs[0]!;
                let doc1: Document = docs[1]!;
                if (doc0.id === doc1.id) {
                    reject(new NoSelfreferenceError("Can't relate to self"));
                }

                doc0.relateTo(doc1, req.relation);
                this.documentRepository.updateDocument(doc0).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    async unrelateDocuments(req: UnrelateDocumentsRequest): Promise<void> {
        return new Promise<void>( (resolve, reject) => {
            let doc0Promise = this.documentRepository.getDocument(req.documentId0);
            let doc1Promise = this.documentRepository.getDocument(req.documentId1);
            return Promise.all([doc0Promise, doc1Promise]).then(docs => {
                if (docs[0] === null) {
                    throw new DocumentNotFoundError("Document not found");
                }
                if (docs[1] === null) {
                    throw new DocumentNotFoundError("Document not found");
                }
                let doc0: Document = docs[0]!;
                let doc1: Document = docs[1]!;

                doc0.unrelateFrom(doc1, req.relation);
                this.documentRepository.updateDocument(doc0).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    public searchDocuments(query: DocumentSearchRequest): Promise<Document[]> {
        return new Promise((resolve, reject) => {
            this.documentRepository.searchDocuments(query).then(resolve).catch(reject);
        });
    }
}