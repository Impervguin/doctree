import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AggregationModule } from './aggregation/aggregation.module';
import { HttpClientModule } from './http-client/http-client.module';
import { SwaggerModule } from './swagger/swagger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AggregationModule,
    HttpClientModule,
    SwaggerModule,
  ],
})
export class AppModule {}