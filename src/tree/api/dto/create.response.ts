import { ApiProperty } from "@nestjs/swagger";

export class CreateNodeResponseDto {
    @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
    id: string;
}

export class CreateRootResponseDto {
    @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
    id: string;
}