import { IsUUID } from 'class-validator';

export class DeleteNodeRequest {
    @IsUUID('4')
    id: string;
}

export class DeleteRootRequest {
    @IsUUID('4')
    id: string;
}