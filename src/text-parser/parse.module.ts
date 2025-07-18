import { Module } from '@nestjs/common';
import { ParsersModule } from './parsers/parsers.module';

@Module({
    providers: [],
    imports: [ParsersModule.forRoot()]
})
export class ParseModule {}