import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReadOnlyGuard } from './readonly.guard';

@Module({
  imports: [ConfigModule],
  providers: [ReadOnlyGuard],
  exports: [ReadOnlyGuard],
})
export class ReadOnlyModule {}