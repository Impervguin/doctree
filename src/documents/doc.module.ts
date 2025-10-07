import { Module } from '@nestjs/common';
import { DocumentController } from './api/doc.controller';
import { DocumentRepository } from './infra/interface.repository';
import { DocumentService } from './services/doc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity, DocumentFileEntity, DocumentTagEntity, DocumentNodeEntity, DocumentRelationEntity, NodeEntity } from './infra/doc.entity';
import { FileModule } from 'src/file/file.module';
import { ConfigModule } from '@nestjs/config';
import { TreeModule } from 'src/tree/tree.module';
import { DocumentControllerV2 } from './api/doc.v2.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PostgresDocumentRepository } from './infra/doc.repository';


@Module({
    controllers: [DocumentController, DocumentControllerV2],
    providers: [{
        provide: DocumentRepository,
        useClass: PostgresDocumentRepository,
    }, DocumentService],
    imports: [TypeOrmModule.forFeature([DocumentEntity, DocumentTagEntity, DocumentFileEntity, DocumentNodeEntity, DocumentRelationEntity, NodeEntity]), FileModule, ConfigModule, TreeModule, AuthModule],
})
export class DocumentModule {}