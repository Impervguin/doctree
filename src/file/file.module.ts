import { Module } from '@nestjs/common';
import { TestController } from './api/test.controller';
import { Client } from 'minio';
import { MetaInfoRepository } from './infra/meta.repository';
import { FileRepository } from './infra/file.repository';
import { MinioClient } from 'src/minio/client/client';
import { MinioModule } from 'src/minio/minio.module';
import { TestService } from './services/test.service';
import { UploadFileService } from './services/upload.service';
import { ConfigModule } from '@nestjs/config';


@Module(
    {
        controllers: [TestController],
        providers: [MetaInfoRepository, FileRepository, TestService, UploadFileService],
        imports: [MinioModule, ConfigModule]
    }
)
export class FileModule {}

