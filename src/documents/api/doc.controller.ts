import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { DocumentService } from '../services/doc.service';
import { DocumentCreateRequest } from '../services/requests/doc.create';


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

}