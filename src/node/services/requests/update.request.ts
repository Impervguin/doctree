import { IsString, IsUUID } from 'class-validator';

export class UpdateNodeRequest {
    @IsUUID('4')
    id: string;

    @IsString()
    title: string;

    @IsUUID('4')
    parentId: string;
}