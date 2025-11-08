import { Module } from '@nestjs/common';
import { ParsersModule } from './parsers/parsers.module';
import { ParseService } from './services/parse.service';
import { FileModule } from '../file/file.module';


@Module({
    controllers: [],
    imports: [ParsersModule.forRoot(), FileModule],
    providers: [ParseService],
    exports: [ParseService],
})
export class ParseModule {}