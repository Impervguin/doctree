import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { FileModule } from './file/file.module';
import { MinioModule } from './minio/minio.module';
import { ParseModule } from './text-parser/parse.module';
import { ParsingJobModule } from './parser-jobs/job.module';
import { ReadOnlyModule } from '@doctree/shared/readonly/readonly.module';

@Module({
  imports: [
    DatabaseModule,
    FileModule,
    MinioModule,
    ParseModule,
    // ...(process.env.READONLY_MODE === 'true' ? [] : [ParsingJobModule]),
    ReadOnlyModule,
  ],
})
export class AppModule {}