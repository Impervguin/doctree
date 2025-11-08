import { ApiProperty } from "@nestjs/swagger";
import { StoredFileInfo } from "src/file/domain/meta.domain";

export class GetFileResponse {
    @ApiProperty({ type: String, description: 'File id', example: '8fe5f2c8-d5ed-4077-bb9a-322cd67a3a0f' })
    id: string;

    @ApiProperty({ type: String, description: 'File title', example: 'Node-title' })
    title: string;

    @ApiProperty({ type: String, description: 'File description', example: 'Node-title' })
    description: string | null;

    @ApiProperty({ type: String, description: 'File url', example: '/files/8fe5f2c8-d5ed-4077-bb9a-322cd67a3a0f/file' })
    fileUrl: string;
}

export function GetFileResponseFromDomain(fileInfo: StoredFileInfo): GetFileResponse {
    return {
        id: fileInfo.id,
        title: fileInfo.title,
        description: fileInfo.description,
        fileUrl: fileInfo.filebucket + "/" + fileInfo.filekey
    };
}

export class DownloadFileResponse {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string;
    file: Buffer;
}

export function DownloadFileResponseFromDomain(fileInfo: StoredFileInfo, file: Buffer): DownloadFileResponse {
    return {
        id: fileInfo.id,
        title: fileInfo.title,
        description: fileInfo.description,
        fileUrl: fileInfo.filebucket + "/" + fileInfo.filekey,
        file: file
    };  
}   