import { Module } from '@nestjs/common';
import { FileInfoRepository } from './infra/info.repository';
import { FileRepository } from './infra/file.repository';
import { MinioModule } from 'src/minio/minio.module';
import { UploadFileService } from './services/upload.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileInfo } from './infra/info.entity';
import { TestController } from './api/test.cont';


@Module(
    {
        controllers: [TestController],
        providers: [FileInfoRepository, FileRepository, UploadFileService],
        imports: [MinioModule, ConfigModule, TypeOrmModule.forFeature([FileInfo])]
    }
)
export class FileModule {}

