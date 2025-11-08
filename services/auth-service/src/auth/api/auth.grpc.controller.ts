import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';
import { Admin } from '../domain/admin.model';
import { GrpcLoggingInterceptor, LoggingInterceptor } from '@doctree/shared/utils/logging.interceptor';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class AuthGrpcController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthReadService', 'VerifyAccessToken')
  async verifyAccessToken(data: { token: string }): Promise<{ valid: boolean; user?: any }> {
    try {
      const user = await this.authService.verifyUser(data.token);
      return { valid: true, user: { id: user.id, username: user.username } };
    } catch (e) {
      return { valid: false };
    }
  }

  @GrpcMethod('AuthReadService', 'GetUserPermissions')
  async getUserPermissions(data: { userId: string }): Promise<{ permissions: string[] }> {
    const user = await this.authService.getUserById(data.userId);
    if (!user) {
      return { permissions: [] };
    }
    const permissions: string[] = [];
    if (user.HaveAppUserRights()) {
      permissions.push('user');
    }
    if (user.HavePlannerRights()) {
      permissions.push('planner');
    }
    if (user.HaveAdminRights()) {
      permissions.push('admin');
    }
    return { permissions };
  }
}