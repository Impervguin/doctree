import { TypeOrmModule } from "@nestjs/typeorm";
import { TreeEntity } from "./infra/tree.entity";
import { TreeService } from "./services/tree.service";
import { TreeRepository } from "./infra/tree.interface";
import { TreeController } from "./api/tree.controller";
import { Module } from "@nestjs/common";
import { TreeControllerV2 } from "./api/tree.v2.controller";
import { TreeGrpcController } from "./api/tree.grpc.controller";
import { NodeService } from "./services/node.service";
import { NodeRepository } from "./infra/node.interface";
import { NodeEntity } from "./infra/node.entity";
import { PostgresTreeRepository } from "./infra/tree.repository";
import { PostgresNodeRepository } from "./infra/node.repository";
import { AuthClientModule } from "src/auth-client.module";

@Module(
    {
        controllers: [TreeController, TreeControllerV2, TreeGrpcController],
        providers: [TreeService, { provide: TreeRepository, useClass: PostgresTreeRepository }, NodeService, { provide: NodeRepository, useClass: PostgresNodeRepository }],
        imports: [
            TypeOrmModule.forFeature([TreeEntity, NodeEntity]),
            AuthClientModule,
        ],
        exports: [TreeService, NodeService]
    }
)
export class TreeModule {}