import { IsString, IsUUID } from 'class-validator';

export class CreateNodeRequest {
    @IsUUID('4')
    parentId: string;

    @IsString()
    title: string;
}

export class CreateRootRequest {
    @IsString()
    title: string;
}