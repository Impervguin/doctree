import { Module } from '@nestjs/common';
import { NodeController } from './api/node.controller';
import { NodeService } from './app/node.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeEntity } from './infra/node.entity';
import { NodeRepository } from './infra/node.repository';


@Module(
    {
        controllers: [NodeController],
        providers: [NodeService, NodeRepository],
        imports: [
            TypeOrmModule.forFeature([NodeEntity])
        ]
    }
)
export class NodeModule {}