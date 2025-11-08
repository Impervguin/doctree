import { Module } from '@nestjs/common';
import { AggregationService } from './aggregation.service';
import { HttpClientModule } from '../http-client/http-client.module';

@Module({
  imports: [HttpClientModule],
  providers: [AggregationService],
  exports: [AggregationService],
})
export class AggregationModule {}