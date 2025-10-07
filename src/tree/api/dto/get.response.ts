import { ApiProperty } from '@nestjs/swagger';

export class TreeDto {
    @ApiProperty({ type: String, description: 'Tree id', example: '8fe5f2c8-d5ed-4077-bb9a-322cd67a3a0f' })
    id: string;
    @ApiProperty({ type: String, description: 'Tree title', example: 'Node-title' })
    title: string;  
    @ApiProperty({ type: [TreeDto], description: 'Tree children' })
    children: TreeDto[];
}

export class GetAllTreesResponseDto {
    @ApiProperty({ type: [TreeDto] })
    trees: TreeDto[];
}

export class GetSubTreeResponseDto {
    @ApiProperty({ type: TreeDto })
    tree: TreeDto;
}

export class GetRootTreeResponseDto {
    @ApiProperty({ type: TreeDto })
    tree: TreeDto;
}


export class NodeDto {
    @ApiProperty({ type: String, description: 'Node id', example: '8fe5f2c8-d5ed-4077-bb9a-322cd67a3a0f' })
    id: string;
    @ApiProperty({ type: String, description: 'Node title', example: 'Node-title' })
    title: string;
    @ApiProperty({ type: String, description: 'Parent node id', example: '8fe5f2c8-d5ed-4077-bb9a-322cd67a3a0f' })
    parentId: string | null;
}


export class GetAllNodeResponseDto {
    @ApiProperty({ type: [NodeDto] })
    nodes: NodeDto[];
}

export class GetNodeResponseDto {
    @ApiProperty({ type: NodeDto })
    node: NodeDto;
}