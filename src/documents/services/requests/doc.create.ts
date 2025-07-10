import { IsArray, IsOptional, IsString } from "class-validator";


export class DocumentCreateRequest {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsArray()
    @IsString({ each: true })
    tags: string[];
}