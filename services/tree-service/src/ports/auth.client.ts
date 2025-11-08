import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

export interface VerifyAccessTokenResponse {
  valid: boolean;
  user?: { id: string; username: string };
}

export interface UserPermissionsResponse {
  permissions: string[];
}

export interface AuthServiceGrpc {
  VerifyAccessToken(data: { token: string }): Observable<VerifyAccessTokenResponse>;
  GetUserPermissions(data: { userId: string }): Observable<UserPermissionsResponse>;
}

@Injectable()
export class AuthClient {
  constructor(@Inject('AUTH_SERVICE') private client: ClientGrpc) {}

  private get authService(): AuthServiceGrpc {
    return this.client.getService<AuthServiceGrpc>('AuthReadService');
  }

  async verifyAccessToken(token: string): Promise<VerifyAccessTokenResponse> {
    return firstValueFrom(this.authService.VerifyAccessToken({ token }));
  }

  async getUserPermissions(userId: string): Promise<UserPermissionsResponse> {
    return firstValueFrom(this.authService.GetUserPermissions({ userId }));
  }
}