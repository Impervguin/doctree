import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { DocumentService } from "../services/doc.service";
import { AppUserGuard } from "src/auth/middle/user.guard";
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { DocumentCreateRequest } from "../services/requests/doc.create";
import { DocumentSearchRequest } from "../services/requests/doc.search";
import { GetDocumentResponseDto, SearchDocumentsResponseDto } from "./dto/doc.get";
import { DocumentMapper, NodeWithDocumentMapper } from "./dto/doc.mapper";
import { DocumentUpdateRequest } from "../services/requests/doc.update";
import { NodeWithDocumentsResponseDto } from "./dto/node.doc.get";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileValidationPipe } from "src/file/pipes/validate.pipe";
import { AttachDocumentToNodeRequest, DetachDocumentFromNodeRequest, RelateDocumentsRequest } from "../services/requests/doc.link";
import { plainToClass } from "class-transformer";
import { DocumentRelationType } from "../domain/doc.model";
import { DocumentNotAttachedError, DocumentNotFoundError, DocumentNotLinkedError, NodeNotFoundError, NoSelfreferenceError } from "../services/errors.service";
import { CreateDocumentResponseDto } from "./dto/doc.create";



@Controller({
    path: 'docs',
    version: '2'
})
export class DocumentControllerV2 {
    constructor(private readonly docService: DocumentService) {}

    @Post("")
    @UseGuards(AppUserGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Create a new document' })
    @ApiResponse({ status: 201, description: 'Document successfully created' })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async createDocument(@Body() req: DocumentCreateRequest) : Promise<CreateDocumentResponseDto> {
        const doc = await this.docService.createDocument(req);
        return {id: doc.id};
    }

    @Get("")
    @UseGuards(AppUserGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Search documents' })
    @ApiResponse({ status: 200, description: 'Documents found', type: SearchDocumentsResponseDto})
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async searchDocuments(@Query() query: DocumentSearchRequest) : Promise<SearchDocumentsResponseDto> {
        const docs = await this.docService.searchDocuments(query);
        return {docs: docs.map(doc => DocumentMapper.toDto(doc))};
    }

    @Get(":id")
    @UseGuards(AppUserGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Get document by id' })
    @ApiResponse({ status: 200, description: 'Document found', type: GetDocumentResponseDto})
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Document not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiParam({ name: 'id', type: String, description: 'Document id' })
    async getDocument(@Param('id', new ParseUUIDPipe({ version: '4' })) docId: string): Promise<GetDocumentResponseDto> {
        try {
            const doc = await this.docService.getDocument(docId);
            return { doc: DocumentMapper.toDto(doc) };
        } catch (e) {
            if (e instanceof DocumentNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @Patch(":id")
    @UseGuards(AppUserGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Update document' })
    @ApiResponse({ status: 200, description: 'Document updated' })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Document not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiParam({ name: 'id', type: String, description: 'Document id' })
    @ApiBody({ type: DocumentUpdateRequest })
    async updateDocument(@Param('id', new ParseUUIDPipe({ version: '4' })) docId: string, @Body() req: DocumentUpdateRequest): Promise<void> {
        try {
            await this.docService.updateDocument(docId, req);
        } catch (e) {
            if (e instanceof DocumentNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @Delete(":id")
    @UseGuards(AppUserGuard)
    @ApiOperation({ summary: 'Delete document' })
    @ApiResponse({ status: 200, description: 'Document deleted' })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Document not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiParam({ name: 'id', type: String, description: 'Document id' })
    async deleteDocument(@Param('id', new ParseUUIDPipe({ version: '4' })) docId: string): Promise<void> {
        try {
            await this.docService.deleteDocument(docId);
        } catch (e) {
            if (e instanceof DocumentNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    // @Get("nodes/:nodeId")
    // @UseGuards(AppUserGuard)
    // @UsePipes(new ValidationPipe())
    // @ApiOperation({ summary: 'Get node with its documents' })
    // @ApiResponse({ status: 200, description: 'Node found', type: NodeWithDocumentsResponseDto })
    // @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    // @ApiResponse({ status: 404, description: 'Node not found' })
    // @ApiResponse({ status: 400, description: 'Bad request' })
    // @ApiParam({ name: 'nodeId', type: String, description: 'Node id' })
    // async getNodeWithDocuments(@Param('nodeId', new ParseUUIDPipe({ version: '4' })) nodeId: string): Promise<NodeWithDocumentsResponseDto> {
    //     try {
    //         const node = await this.docService.getNodeWithDocuments(nodeId);
    //         return NodeWithDocumentMapper.toDto(node);
    //     } catch (e) {
    //         if (e instanceof DocumentNotFoundError || e instanceof NodeNotFoundError) {
    //             throw new NotFoundException(e.message);
    //         }
    //         throw e;
    //     }
    // }

    @Patch(":id/files")
    @UseGuards(AppUserGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Link file to document' })
    @ApiResponse({ status: 201, description: 'File linked to document' })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Document not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiParam({ name: 'id', type: String, description: 'Document id' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'File to upload',
        schema: {
            type: 'object',
            properties: {
            file: {
                type: 'string',
                format: 'binary',
                description: 'The file to upload',
            },
            },
            required: ['file']
        }
    })
    async linkFile(@Param('id', new ParseUUIDPipe({ version: '4' })) docId: string, @UploadedFile(FileValidationPipe) file: Express.Multer.File) {
        try {
            await this.docService.linkFile({
                documentId: docId,
                file: {
                    filename: file.originalname,
                    buffer: file.buffer,
                    size: file.size
                }
            });
        } catch (e) {
            if (e instanceof DocumentNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @Delete(":id/files/:fileId")
    @UseGuards(AppUserGuard)
    @ApiOperation({ summary: 'Unlink file from document' })
    @ApiResponse({ status: 200, description: 'File unlinked from document' })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Document not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiParam({ name: 'id', type: String, description: 'Document id' })
    @ApiParam({ name: 'fileId', type: String, description: 'File id' })
    async unlinkFile(@Param('id', new ParseUUIDPipe({ version: '4' })) docId: string, @Param('fileId', new ParseUUIDPipe({ version: '4' })) fileId: string) {
        try {
            await this.docService.unlinkFile({
                documentId: docId,
                fileId: fileId
            });
        } catch (e) {
            if (e instanceof DocumentNotFoundError || e instanceof DocumentNotLinkedError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @Patch(":id/nodes/:nodeId")
    @UseGuards(AppUserGuard)
    @ApiOperation({ summary: 'Attach document to node' })
    @ApiResponse({ status: 200, description: 'Document attached to node without move' })
    @ApiResponse({ status: 201, description: 'Document attached to node with move' })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Document not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async attachDocumentToNode(@Param('id', new ParseUUIDPipe({ version: '4' })) docId: string, @Param('nodeId', new ParseUUIDPipe({ version: '4' })) nodeId: string): Promise<Response> {
        const req = plainToClass(AttachDocumentToNodeRequest, {
            documentId: docId,
            nodeId: nodeId,
            move: true
        });
        try {
            const res = await this.docService.attachDocumentToNode(req);
            if (res.moved) {
                return new Response(null, { status: 201 });
            }
            return new Response(null, { status: 200 });
        } catch (e) {
            if (e instanceof DocumentNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @Delete(":id/nodes/:nodeId")
    @UseGuards(AppUserGuard)
    @ApiOperation({ summary: 'Detach document from node' })
    @ApiResponse({ status: 200, description: 'Document detached from node' })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Document not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async detachDocumentFromNode(@Param('id', new ParseUUIDPipe({ version: '4' })) docId: string, @Param('nodeId', new ParseUUIDPipe({ version: '4' })) nodeId: string): Promise<void> {
        try {
            const req = plainToClass(DetachDocumentFromNodeRequest, {
                documentId: docId,
                nodeId: nodeId
            });
            await this.docService.detachDocumentFromNode(req);
        } catch (e) {
            if (e instanceof DocumentNotFoundError || e instanceof DocumentNotAttachedError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @Patch(":id/relations/:relatedId")
    @UseGuards(AppUserGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Setup relation between documents' })
    @ApiResponse({ status: 201, description: 'Documents related' })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Document not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async relateDocuments(@Param('id', new ParseUUIDPipe({ version: '4' })) docId: string, @Body() @Param('relatedId', new ParseUUIDPipe({ version: '4' })) relatedId: string): Promise<void> {
        const req = plainToClass(RelateDocumentsRequest, {
            documentId0: docId,
            documentId1: relatedId,
            relation: DocumentRelationType.UsedBy
        });
        try {
            await this.docService.relateDocuments(req);
        } catch (e) {
            if (e instanceof DocumentNotFoundError || e instanceof NoSelfreferenceError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @Delete(":id/relations/:relatedId")
    @UseGuards(AppUserGuard)
    @ApiOperation({ summary: 'Remove relation between documents' })
    @ApiResponse({ status: 200, description: 'Documents unrelated' })
    @ApiResponse({ status: 403, description: 'Do not have rights on this operation' })
    @ApiResponse({ status: 404, description: 'Document not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async unrelateDocuments(@Param('id', new ParseUUIDPipe({ version: '4' })) docId: string, @Body() @Param('relatedId', new ParseUUIDPipe({ version: '4' })) relatedId: string): Promise<void> {
        const req = plainToClass(RelateDocumentsRequest, {
            documentId0: docId,
            documentId1: relatedId,
            relation: DocumentRelationType.UsedBy
        });
        try {
            await this.docService.unrelateDocuments(req);
        } catch (e) {
            if (e instanceof DocumentNotFoundError) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }
}