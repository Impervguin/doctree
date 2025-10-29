import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReadOnlyModeError } from '../errors/errors';

@Injectable()
export class ReadOnlyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const isReadOnly = this.configService.get('READONLY_MODE') === 'true';
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    if (isReadOnly && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      throw new ReadOnlyModeError();
    }

    return true;
  }
}