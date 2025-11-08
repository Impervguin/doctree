import { ApiProperty } from "@nestjs/swagger";
import { DocumentFileDto } from "./doc.get";


export class NodeDocumentDto {
    @ApiProperty({ type: String, description: 'Document id', example: '8fe5f2c8-d5ed-4077-bb9a-322cd67a3a0f' })
    id: string;

    @ApiProperty({ type: String, description: 'Document title', example: 'Node-title' })
    title: string;

    @ApiProperty({ type: String, description: 'Document description', example: 'Node-title' })
    description: string | null;

    @ApiProperty({ type: [String], description: 'Document tags', example: ['tag1', 'tag2'] })
    tags: string[];

    @ApiProperty({ type: [DocumentFileDto], description: 'Document files' })
    files: DocumentFileDto[];
}

export class NodeWithDocumentDto {
    @ApiProperty({ type: String, description: 'Node title', example: 'Node-title' })
    nodeTitle: string;

    @ApiProperty({ type: [NodeDocumentDto], description: 'Documents' })
    documents: NodeDocumentDto[];
}

export class NodeWithDocumentsResponseDto extends NodeWithDocumentDto {}