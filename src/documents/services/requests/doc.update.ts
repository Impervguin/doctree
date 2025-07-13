import { IsArray, IsOptional, IsString } from "class-validator";


export class DocumentUpdateRequest {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}