import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  const documentConfigv1 = new DocumentBuilder()
    .setTitle('Doctree API')
    .setDescription('API for document hierarchy')
    .setVersion('1.0')
    .build();
  
  var document = SwaggerModule.createDocument(app, documentConfigv1);

  const v1Document = {
    ...document,
    paths : Object.fromEntries(
      Object.entries(document.paths).filter(([p]) => p.startsWith('/api/v1') || p.startsWith('/v1')),
    ),
  }

  SwaggerModule.setup('api/v1', app, v1Document);

  const documentConfigv2 = new DocumentBuilder()
    .setTitle('Doctree API')
    .setDescription('API for document hierarchy')
    .setVersion('2.0')
    .build();
  
  var document = SwaggerModule.createDocument(app, documentConfigv2);

  const v2Document = {
    ...document,
    paths : Object.fromEntries(
      Object.entries(document.paths).filter(([p]) => p.startsWith('/api/v2') || p.startsWith('/v2')),
    ),
  }
  SwaggerModule.setup('api/v2', app, v2Document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
