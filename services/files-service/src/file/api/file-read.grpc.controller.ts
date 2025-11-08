import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UploadFileService } from '../services/upload.service';
import { DownloadFileRequest, FileBuffer, GetFileInfoRequest, FileInfo } from './dto/file.dto';
import { serializeDate } from '@doctree/shared/utils/date';
import { GrpcLoggingInterceptor, LoggingInterceptor } from '@doctree/shared/utils/logging.interceptor';
import { UseInterceptors } from '@nestjs/common';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class FileReadGrpcController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @GrpcMethod('FileReadService', 'GetFileInfo')
  async getFileInfo(data: GetFileInfoRequest): Promise<FileInfo | null> {
    const result = await this.uploadFileService.getFileInfo(data.fileId);
    if (!result) return null;
    return {
      id: result.id,
      title: result.title,
      description: result.description ? result.description : "",
      filebucket: result.filebucket,
      filekey: result.filekey,
      createdAt: serializeDate(result.createdAt),
      updatedAt: serializeDate(result.updatedAt),
      deletedAt: result.deletedAt ? serializeDate(result.deletedAt) : undefined,
    };
  }

  @GrpcMethod('FileReadService', 'DownloadFile')
  async downloadFile(data: DownloadFileRequest): Promise<FileBuffer | null> {
    const result = await this.uploadFileService.downloadFile(data.fileId);
    if (!result) return null;
    return {
      id: result.id,
      filename: result.title,
      buffer: result.file,
    };
  }
}