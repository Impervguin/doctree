import { Module } from '@nestjs/common';
import { NodeController } from './api/node.controller';
import { NodeService } from './services/node.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeEntity } from './infra/node.entity';
import { PostgresNodeRepository } from './infra/node.repository';
import { NodeRepository } from './infra/node.interface';


@Module(
    {
        controllers: [NodeController],
        providers: [NodeService, {
            provide: NodeRepository,
            useClass: PostgresNodeRepository,
        }],
        imports: [
            TypeOrmModule.forFeature([NodeEntity])
        ]
    }
)
export class NodeModule {}