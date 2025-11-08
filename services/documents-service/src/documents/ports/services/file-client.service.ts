import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { FileInfo, UploadFileRequest, UploadFileResponse } from '../dto/file-client.dto';

export interface FileReadServiceGrpc {
  GetFileInfo(data: { fileId: string }): Observable<FileInfo>;
}

export interface FileWriteServiceGrpc {
  UploadFile(data: UploadFileRequest): Observable<UploadFileResponse>;
  DeleteFile(data: { fileId: string }): Observable<{ success: boolean }>;
}

@Injectable()
export class FileClient {
  constructor(
    @Inject('FILE_READ_SERVICE') private readClient: ClientGrpc,
    @Inject('FILE_WRITE_SERVICE') private writeClient: ClientGrpc,
  ) {}

  private get fileReadService(): FileReadServiceGrpc {
    return this.readClient.getService<FileReadServiceGrpc>('FileReadService');
  }

  private get fileWriteService(): FileWriteServiceGrpc {
    return this.writeClient.getService<FileWriteServiceGrpc>('FileWriteService');
  }

  async getFileInfo(fileId: string): Promise<FileInfo> {
    return firstValueFrom(this.fileReadService.GetFileInfo({ fileId }));
  }

  async uploadFile(data: UploadFileRequest): Promise<UploadFileResponse> {
    return firstValueFrom(this.fileWriteService.UploadFile(data));
  }

  async deleteFile(fileId: string): Promise<void> {
    return firstValueFrom(this.fileWriteService.DeleteFile({ fileId })).then(() => {});
  }
}