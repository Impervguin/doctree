import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HierarchyController } from './hierarchy/hierarchy.controller';

@Module({
  imports: [],
  controllers: [AppController, HierarchyController],
  providers: [AppService],
})
export class AppModule {}
