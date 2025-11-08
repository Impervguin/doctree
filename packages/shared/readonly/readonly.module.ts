import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReadOnlyGuard, ReadOnlyHardGuard } from './readonly.guard';

@Module({
  imports: [ConfigModule],
  providers: [ReadOnlyGuard, ReadOnlyHardGuard, ConfigService],
  exports: [ReadOnlyGuard, ReadOnlyHardGuard],
})
export class ReadOnlyModule {}