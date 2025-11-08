import { Module } from '@nestjs/common';
import { SwaggerService } from './swagger.service';
import { AggregationModule } from '../aggregation/aggregation.module';

@Module({
  imports: [AggregationModule],
  providers: [SwaggerService],
  exports: [SwaggerService],
})
export class SwaggerModule {}