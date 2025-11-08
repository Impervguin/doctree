import { Injectable } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AggregationService } from '../aggregation/aggregation.service';

@Injectable()
export class SwaggerService {
  constructor(private aggregationService: AggregationService) {}

  async setupSwagger(app: INestApplication, globalPrefix: string = '') {
    const v1Spec = await this.aggregationService.getMergedSpec('v1', globalPrefix);
    SwaggerModule.setup('/api/v1', app, v1Spec);

    const v2Spec = await this.aggregationService.getMergedSpec('v2', globalPrefix);
    SwaggerModule.setup('/api/v2', app, v2Spec);
  }
}