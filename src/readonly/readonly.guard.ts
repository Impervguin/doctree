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

    if (isReadOnly && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && !request.url.startsWith('/api/v2/auth/login')) {
      throw new ReadOnlyModeError('This operation is not allowed in read-only mode. Please use the main application instance for write operations.');
    }

    return true;
  }
}