import { IsString, IsUUID } from 'class-validator';

export class UpdateNodeTitleRequest {
    @IsUUID('4')
    id: string;

    @IsString()
    title: string;
}
