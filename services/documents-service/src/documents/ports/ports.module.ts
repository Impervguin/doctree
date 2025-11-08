import { Module } from '@nestjs/common';
import { AuthClientModule } from './modules/auth-client.module';
import { FileClientModule } from './modules/file-client.module';
import { TreeClientModule } from './modules/tree-client.module';
import { AuthClient } from './services/auth-client.service';
import { FileClient } from './services/file-client.service';
import { TreeClient } from './services/tree-client.service';

@Module({
  imports: [
    AuthClientModule,
    FileClientModule,
    TreeClientModule,
  ],
  providers: [
    AuthClient,
    FileClient,
    TreeClient,
  ],
  exports: [
    AuthClient,
    FileClient,
    TreeClient,
  ],
})
export class GrpcPortsModule {}