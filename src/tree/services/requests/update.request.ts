import { IsUUID, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateNodeParentRequest {
  @IsUUID()
  @ApiProperty({
    example: '8fe5f2c8-d5ed-4077-bb9a-322cd67a3a0f',
    description: 'Node id',
  })
  id: string;

  @IsUUID()
  @ApiProperty({
    example: '8fe5f2c8-d5ed-4077-bb9a-322cd67a3a0f',
    description: 'Node id',
  })
  parentId: string;
}

export class UpdateNodeTitleRequest {
    @IsUUID('4')
    @ApiProperty({
        example: '8fe5f2c8-d5ed-4077-bb9a-322cd67a3a0f',
        description: 'Node id',
    })
    id: string;

    @IsString()
    @ApiProperty({
        example: 'Node-title',
        description: 'Node title',
    })
    title: string;
}

export class UpdateNodeRequest {
    @IsUUID('4')
    @ApiProperty({
        example: '8fe5f2c8-d5ed-4077-bb9a-322cd67a3a0f',
        description: 'Node id',
    })
    id: string;

    @IsUUID('4')
    @ApiProperty({
      example: '8fe5f2c8-d5ed-4077-bb9a-322cd67a3a0f',
      description: 'Node id',
    })
    parentId: string;

    @IsString()
    @ApiProperty({
      example: 'Node-title',
      description: 'Node title',
    })
    title: string
}