import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { AuthClientModule } from './auth-client.module';
import { TreeModule } from './tree/tree.module';
import { NodeModule } from './node/node.module';
import { ReadOnlyModule } from '@doctree/shared/readonly/readonly.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TreeModule,
    NodeModule,
    AuthClientModule,
    ReadOnlyModule
  ],
})
export class AppModule {}