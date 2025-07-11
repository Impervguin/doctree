import { Module } from '@nestjs/common';
import { DocumentController } from './api/doc.controller';
import { DocumentRepository } from './infra/doc.repository';
import { DocumentService } from './services/doc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity, DocumentFileEntity, DocumentTagEntity } from './infra/doc.entity';
import { FileModule } from 'src/file/file.module';
import { UploadFileService } from 'src/file/services/upload.service';
import { ConfigModule } from '@nestjs/config';


@Module({
    controllers: [DocumentController],
    providers: [DocumentRepository, DocumentService],
    imports: [TypeOrmModule.forFeature([DocumentEntity, DocumentTagEntity, DocumentFileEntity]), FileModule, ConfigModule],
})
export class DocumentModule {}