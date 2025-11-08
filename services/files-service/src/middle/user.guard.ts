import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ParseCookies } from '@doctree/shared/utils/parse.cookies';
import { Request } from 'express';
import { AuthClient } from '../ports/auth.client';

@Injectable()
export class PlannerGuard implements CanActivate {
  constructor(private authClient: AuthClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const token = getAccessToken(req);
    if (!token) {
      return false;
    }

    try {
      const result = await this.authClient.verifyAccessToken(token);
      if (result.valid && result.user) {
        // Check permissions
        const permissions = await this.authClient.getUserPermissions(result.user.id);
        return permissions.permissions.includes('planner');
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}

function getAccessToken(req: Request): string | undefined {
  const cookies = ParseCookies(req as any);
  if ('access_token' in cookies) {
    return cookies['access_token'];
  }
  return undefined;
}