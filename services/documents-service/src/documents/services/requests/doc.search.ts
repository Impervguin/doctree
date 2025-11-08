import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class DocumentSearchRequest {
    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'Doc-oc',
        description: 'Document title',
        required: false,
    })
    title?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'Doctor octopus',
        description: 'Document description',
        required: false,
    })
    description?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'octopus',
        description: 'Document tag',
        required: false,
    })
    tag?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'octopuses have 8 tentacles (do not search on rule 64)',
        description: 'Document text',
        required: false,
    })
    text?: string;

    @IsOptional()
    @IsUUID('4')
    @ApiProperty({
        example: '00000000-0000-0000-0000-000000000000',
        description: 'Document node id',
        required: false,
    })
    nodeId?: string;
}
