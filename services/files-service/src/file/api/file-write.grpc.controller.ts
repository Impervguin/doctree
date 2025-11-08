import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UploadFileService } from '../services/upload.service';
import { BufferedFile } from '../domain/bufferedfile.domain';
import { DeleteFileRequest, DeleteFileResponse, UploadFileRequest, FileInfo } from './dto/file.dto';
import { serializeDate } from '@doctree/shared/utils/date';
import { GrpcLoggingInterceptor, LoggingInterceptor } from '@doctree/shared/utils/logging.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { ReadOnlyHardGuard } from '@doctree/shared/readonly/readonly.guard';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class FileWriteGrpcController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @GrpcMethod('FileWriteService', 'UploadFile')
  @UseGuards(ReadOnlyHardGuard)
  async uploadFile(data: UploadFileRequest): Promise<FileInfo> {
    const bufferedFile = {
      filename: data.filename,
      buffer: data.buffer,
      size: data.size,
    }
    const result = await this.uploadFileService.uploadFile({
      file: bufferedFile,
      filebucket: data.filebucket,
      filedir: data.filedir,
    });

    return {
      id: result.id,
      title: result.title,
      description: result.description ? result.description : "",
      filebucket: result.filebucket,
      filekey: result.filekey,
      createdAt: serializeDate(result.createdAt),
      updatedAt: serializeDate(result.updatedAt),
      deletedAt: result.deletedAt ? serializeDate(result.deletedAt) : undefined,
    }
  }

  @GrpcMethod('FileWriteService', 'DeleteFile')
  @UseGuards(ReadOnlyHardGuard)
  async deleteFile(data: DeleteFileRequest): Promise<DeleteFileResponse> {
    try {
      await this.uploadFileService.deleteFile(data.fileId);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}