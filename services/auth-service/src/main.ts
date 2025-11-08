import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from '@doctree/shared/utils/logging.interceptor';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { ReadOnlyGuard } from '@doctree/shared/readonly/readonly.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalGuards(new ReadOnlyGuard(configService));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  
  const globalPrefix = configService.get('GLOBAL_PREFIX', '');

  const documentConfigv1 = new DocumentBuilder()
  .setTitle('Doctree API')
  .setDescription('API for document hierarchy')
  .setVersion('1.0')
  .addServer(globalPrefix)
  .build();

  var document = SwaggerModule.createDocument(app, documentConfigv1);

  const v1Document = {
    ...document,
    paths : Object.fromEntries(
      Object.entries(document.paths).filter(([p]) => p.startsWith('/api/v1') || p.startsWith('/v1')),
    ),
  }

  SwaggerModule.setup('/api/v1', app, v1Document);

  const documentConfigv2 = new DocumentBuilder()
    .setTitle('Doctree API')
    .setDescription('API for document hierarchy')
    .setVersion('2.0')
    .addServer(globalPrefix)
    .build();

  var document = SwaggerModule.createDocument(app, documentConfigv2);

  const v2Document = {
    ...document,
    paths : Object.fromEntries(
      Object.entries(document.paths).filter(([p]) => p.startsWith('/api/v2') || p.startsWith('/v2')),
    ),
  }
  SwaggerModule.setup('/api/v2', app, v2Document);

  // HTTP server
  await app.listen(process.env.PORT ?? 3001);

  // gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: "../protos/authorization.proto",
      url: `0.0.0.0:${process.env.GRPC_PORT ?? 50051}`,
    },
  });

  await app.startAllMicroservices();
}

bootstrap();