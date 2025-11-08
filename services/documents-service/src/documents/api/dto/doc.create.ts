import { ApiProperty } from "@nestjs/swagger";

export class CreateDocumentResponseDto {
    @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
    id: string;
}