import { Module } from '@nestjs/common';
import {  PostgresFileInfoRepository } from './infra/info.repository';
import { MinioFileRepository } from './infra/file.repository';
import { MinioModule } from 'src/minio/minio.module';
import { UploadFileService } from './services/upload.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileInfo } from './infra/info.entity';
import { StoredFileInfo } from './domain/meta.domain';
import { FileRepository } from './infra/file.interface';
import { FileInfoRepository } from './infra/info.inteface';


@Module(
    {
        providers: [{
            provide: FileInfoRepository,
            useClass: PostgresFileInfoRepository,
        }, {
            provide: FileRepository,
            useClass: MinioFileRepository,
        }, 
        UploadFileService],
        imports: [MinioModule, ConfigModule, TypeOrmModule.forFeature([FileInfo])],
        exports: [UploadFileService]
    }
)
export class FileModule {}

