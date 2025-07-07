import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NodeModule } from './node/node.module';
import { DatabaseModule } from './database/database.module';
import { TreeModule } from './tree/tree.module';

@Module({
  imports: [DatabaseModule, NodeModule, TreeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
