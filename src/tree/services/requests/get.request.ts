import { IsUUID } from 'class-validator';


export class GetTreeRequest {
    @IsUUID('4')
    id: string;
}