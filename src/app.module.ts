import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NodeModule } from './node/node.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, NodeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
