import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, UsePipes, ValidationPipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DocumentService } from '../services/doc.service';
import { DocumentCreateRequest } from '../services/requests/doc.create';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '../../file/pipes/validate.pipe';
import { AttachDocumentToNodeRequest } from '../services/requests/doc.link';
import { DocumentUpdateRequest } from '../services/requests/doc.update';

@Controller('docs')
export class DocumentController {
    constructor(private documentService: DocumentService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async createDocument(@Body() req: DocumentCreateRequest) {
        await this.documentService.createDocument(req);
    }

    @Get(':id')
    async getDocument(@Param('id') docId: string) {
        return this.documentService.getDocument(docId);
    }

    @Get('node/:id')
    async getNodeWithDocuments(@Param('id') nodeId: string) {
        return this.documentService.getNodeWithDocuments(nodeId);
    }

    @Post(':id/link')
    @UseInterceptors(FileInterceptor('file'))
    async linkFile(@Param('id') docId: string, @UploadedFile(FileValidationPipe) file: Express.Multer.File) {
        await this.documentService.linkFile({
            documentId: docId,
            file: {
                filename: file.originalname,
                buffer: file.buffer,
                size: file.size
            }
        });
    }

    @Post('attach')
    @UsePipes(new ValidationPipe())
    async attachDocumentToNode(@Body() req: AttachDocumentToNodeRequest) {
        await this.documentService.attachDocumentToNode(req);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    async updateDocument(@Param('id') docId: string, @Body() req: DocumentUpdateRequest) {
        await this.documentService.updateDocument(docId, req);
    }

    @Delete(':id')
    async deleteDocument(@Param('id') docId: string) {
        await this.documentService.deleteDocument(docId);
    }
}