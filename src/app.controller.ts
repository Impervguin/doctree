import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ReadOnlyGuard } from './readonly/readonly.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
}
