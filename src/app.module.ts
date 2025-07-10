import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NodeModule } from './node/node.module';
import { DatabaseModule } from './database/database.module';
import { TreeModule } from './tree/tree.module';
import { MinioModule } from './minio/minio.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [DatabaseModule, MinioModule, NodeModule, TreeModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
