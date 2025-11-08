import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from '@doctree/shared/utils/logging.interceptor';
import { SwaggerService } from './swagger/swagger.service';
import { setTimeout } from 'timers/promises';

async function bootstrap() {
  await setTimeout(10000);
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor());

  const swaggerService = app.get(SwaggerService);
  await swaggerService.setupSwagger(app, process.env.GLOBAL_PREFIX ? process.env.GLOBAL_PREFIX : '');
  await app.listen(3000);
}

bootstrap();