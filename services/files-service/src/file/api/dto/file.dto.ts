export interface GetFileInfoRequest {
    fileId: string;
}

export interface UploadFileRequest {
    filebucket: string;
    filename: string;
    buffer: Buffer;
    size: number;
    filedir: string;
}

export interface DownloadFileRequest {
    fileId: string;
}

export interface FileInfo {
    id: string;
    title: string;
    description: string;
    filebucket: string;
    filekey: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export interface FileBuffer {
    id: string;
    filename: string;
    buffer: Buffer;
}

export interface DeleteFileRequest {
    fileId: string;
}

export interface DeleteFileResponse {
    success: boolean;
}