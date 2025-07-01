import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NodeController } from './api/node/node.controller';
import { NodeService } from './utils/services/node/node.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController, NodeController],
  providers: [AppService, NodeService],
})
export class AppModule {}
