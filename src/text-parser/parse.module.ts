import { Module } from '@nestjs/common';
import { ParsersModule } from './parsers/parsers.module';
import { ParseService } from './services/parse.service';
import { ParseController } from './api/parse.controller';
import { FileModule } from 'src/file/file.module';

@Module({
    controllers: [ParseController],
    providers: [ParseService],
    imports: [ParsersModule.forRoot(), FileModule]
})
export class ParseModule {}