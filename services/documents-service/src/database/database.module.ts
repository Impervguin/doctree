import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseStringService } from './db/database.string';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isReadOnly = configService.get('READONLY_MODE') === 'true';
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_NAME', 'nest_app'),
          schema: configService.get('DB_SCHEMA', 'files'),
          logging: configService.get('DB_LOGGING', true),
          autoLoadEntities: true,
          extra: {
              max: configService.get('DB_POOL_MAX', 10),
              min: configService.get('DB_POOL_MIN', 2),
              connectionTimeoutMillis: configService.get('DB_CONN_TIMEOUT', 5000),
              idleTimeoutMillis: configService.get('DB_IDLE_TIMEOUT', 10000),
              },
          ...(isReadOnly && {
            extra: {
              ...{
                max: configService.get('DB_POOL_MAX', 10),
                min: configService.get('DB_POOL_MIN', 2),
                connectionTimeoutMillis: configService.get('DB_CONN_TIMEOUT', 5000),
                idleTimeoutMillis: configService.get('DB_IDLE_TIMEOUT', 10000),
              },
              options: '-c default_transaction_read_only=on'
            }
          }),
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [
    DatabaseStringService,
    {
      provide: 'PG_BOSS',
      useFactory: async (strService: DatabaseStringService) => {
        const PgBoss = require('pg-boss');
        const boss = new PgBoss({
          connectionString: strService.getString(),
          max: 1,
        });
        await boss.start();
        return boss;
      },
      inject: [DatabaseStringService],
    },
  ],
  exports: [TypeOrmModule, DatabaseStringService, 'PG_BOSS'],
})
export class DatabaseModule {}