import { StoredFileInfo } from "src/file/domain/meta.domain";

export interface GetFileResponse {
    id: string;
    title: string;
    description: string | null;
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