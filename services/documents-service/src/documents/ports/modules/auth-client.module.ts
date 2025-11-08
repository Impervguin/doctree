import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthClient } from '../services/auth-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_READ_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth',
            url: configService.get<string>('AUTH_READ_SERVICE_URL', 'localhost:50051'),
            protoPath: "../protos/authorization.proto",
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [AuthClient],
  exports: [ClientsModule, AuthClient],
})
export class AuthClientModule {}