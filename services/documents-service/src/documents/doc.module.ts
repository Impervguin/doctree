import { Module } from '@nestjs/common';
import { DocumentController } from './api/doc.controller';
import { DocumentRepository } from './infra/interface.repository';
import { DocumentService } from './services/doc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity, DocumentFileEntity, DocumentTagEntity, DocumentNodeEntity, DocumentRelationEntity, NodeEntity } from './infra/doc.entity';
import { ConfigModule } from '@nestjs/config';
import { DocumentControllerV2 } from './api/doc.v2.controller';
import { PostgresDocumentRepository } from './infra/doc.repository';
import { GrpcPortsModule } from './ports/ports.module';


@Module({
    controllers: [DocumentController, DocumentControllerV2],
    providers: [{
        provide: DocumentRepository,
        useClass: PostgresDocumentRepository,
    }, DocumentService],
    imports: [TypeOrmModule.forFeature([DocumentEntity, DocumentTagEntity, DocumentFileEntity, DocumentNodeEntity, DocumentRelationEntity, NodeEntity]), ConfigModule, GrpcPortsModule],
})
export class DocumentModule {}