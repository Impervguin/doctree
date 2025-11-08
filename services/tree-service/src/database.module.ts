import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'tree_db'),
        schema: configService.get('DB_SCHEMA', 'tree'),
        logging: configService.get('DB_LOGGING', true),
        autoLoadEntities: true,
        extra: {
          max: configService.get('DB_POOL_MAX', 10),
          min: configService.get('DB_POOL_MIN', 2),
          connectionTimeoutMillis: configService.get('DB_CONN_TIMEOUT', 5000),
          idleTimeoutMillis: configService.get('DB_IDLE_TIMEOUT', 10000),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}