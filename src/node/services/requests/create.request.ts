import { IsString, IsUUID } from 'class-validator';
import { Node } from '../../domain/node.model';

export class CreateNodeRequest {
    @IsString()
    title: string;

    @IsUUID('4')
    parentId: string;
}