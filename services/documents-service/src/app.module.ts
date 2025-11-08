import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { DocumentModule } from './documents/doc.module';
import { GrpcPortsModule } from './documents/ports/ports.module';
import { ReadOnlyModule } from '@doctree/shared/readonly/readonly.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    DocumentModule,
    GrpcPortsModule,
    ReadOnlyModule,
  ],
})
export class AppModule {}