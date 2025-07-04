import { IsUUID } from 'class-validator';


export class GetSubTreeRequest {
    @IsUUID('4')
    id: string;
}