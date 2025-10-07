import { GetFileResponse } from "src/file/services/responses/get.file";
import { ApiProperty } from '@nestjs/swagger';


export class DocumentRelationDto {
    @ApiProperty({ type: String, description: 'Document id', example: '8fe5f2c8-d5ed-4077-bb9a-322cd67a3a0f' })
    documentId: string;

    @ApiProperty({ type: String, description: 'Relation type', example: 'used_by' })
    type: string;
}

export class DocumentNodeDto {
    @ApiProperty({ type: String, description: 'Node id', example: '8fe5f2c8-d5ed-4077-bb9a-322cd67a3a0f' })
    id: string;

    @ApiProperty({ type: String, description: 'Node title', example: 'Node-title' })
    title: string;
}

export class DocumentDto {
    @ApiProperty({ type: String, description: 'Document id', example: '8fe5f2c8-d5ed-4077-bb9a-322cd67a3a0f' })
    id: string;

    @ApiProperty({ type: String, description: 'Document title', example: 'Node-title' })
    title: string;

    @ApiProperty({ type: String, description: 'Document description', example: 'Node-title' })
    description: string | null;

    @ApiProperty({ type: [String], description: 'Document tags', example: ['tag1', 'tag2'] })
    tags: string[];

    @ApiProperty({ type: [GetFileResponse], description: 'Document files' })
    files: GetFileResponse[];

    @ApiProperty({ type: [DocumentNodeDto], description: 'Document nodes' })
    nodes: DocumentNodeDto[];

    @ApiProperty({ type: [DocumentRelationDto], description: 'Document relations' })
    relations: DocumentRelationDto[];
}

export class SearchDocumentsResponseDto {
    @ApiProperty({ type: [DocumentDto], description: 'Documents' })
    docs: DocumentDto[];
}

export class GetDocumentResponseDto {
    @ApiProperty({ type: DocumentDto, description: 'Document' })
    doc: DocumentDto;
}