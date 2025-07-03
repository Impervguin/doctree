import { IsUUID } from 'class-validator';


export class GetNodeRequest {
    @IsUUID('4')
    id: string;
}