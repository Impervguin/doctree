import { Module } from '@nestjs/common';
import {  PostgresFileInfoRepository } from './infra/info.repository';
import { MinioFileRepository } from './infra/file.repository';
import { MinioModule } from '../minio/minio.module';
import { UploadFileService } from './services/upload.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileInfo } from './infra/info.entity';
import { StoredFileInfo } from './domain/meta.domain';
import { FileRepository } from './infra/file.interface';
import { FileInfoRepository } from './infra/info.inteface';
import { FileReadGrpcController } from './api/file-read.grpc.controller';
import { FileWriteGrpcController } from './api/file-write.grpc.controller';
import { ReadOnlyModule } from '@doctree/shared/readonly/readonly.module';


@Module(
    {
        controllers: [FileReadGrpcController, FileWriteGrpcController],
        providers: [{
            provide: FileInfoRepository,
            useClass: PostgresFileInfoRepository,
        }, {
            provide: FileRepository,
            useClass: MinioFileRepository,
        },
        UploadFileService],
        imports: [MinioModule, ConfigModule, TypeOrmModule.forFeature([FileInfo]), ReadOnlyModule],
        exports: [UploadFileService]
    }
)
export class FileModule {}

