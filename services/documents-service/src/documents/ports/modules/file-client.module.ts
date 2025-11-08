import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileClient } from '../services/file-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'FILE_READ_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'files',
            url: configService.get<string>('FILE_READ_SERVICE_URL', 'localhost:50053'),
            protoPath: "../protos/files.proto",
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'FILE_WRITE_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'files',
            url: configService.get<string>('FILE_WRITE_SERVICE_URL', 'localhost:50054'),
            protoPath: "../protos/files.proto",
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [FileClient],
  exports: [ClientsModule, FileClient],
})
export class FileClientModule {}