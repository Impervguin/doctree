export interface FileInfo {
  id: string;
  title: string;
  description?: string;
  filebucket: string;
  filekey: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface UploadFileRequest {
  filebucket: string;
  filename: string;
  buffer: Buffer;
  size: number;
  filedir: string;
}

export interface UploadFileResponse {
  id: string;
}