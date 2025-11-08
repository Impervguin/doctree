import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TreeClient } from '../services/tree-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TREE_READ_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'tree',
            url: configService.get<string>('TREE_READ_SERVICE_URL', 'localhost:50052'),
            protoPath: "../protos/trees_nodes.proto",
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [TreeClient],
  exports: [ClientsModule, TreeClient],
})
export class TreeClientModule {}