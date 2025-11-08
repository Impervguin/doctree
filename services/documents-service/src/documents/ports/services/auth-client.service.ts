import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { VerifyAccessTokenResponse, GetUserPermissionsResponse } from '../dto/auth-client.dto';

export interface AuthReadServiceGrpc {
  VerifyAccessToken(data: { token: string }): Observable<VerifyAccessTokenResponse>;
  GetUserPermissions(data: { userId: string }): Observable<GetUserPermissionsResponse>;
}

@Injectable()
export class AuthClient {
  constructor(@Inject('AUTH_READ_SERVICE') private client: ClientGrpc) {}

  private get authService(): AuthReadServiceGrpc {
    return this.client.getService<AuthReadServiceGrpc>('AuthReadService');
  }

  async verifyAccessToken(token: string): Promise<VerifyAccessTokenResponse> {
    return firstValueFrom(this.authService.VerifyAccessToken({ token }));
  }

  async getUserPermissions(userId: string): Promise<GetUserPermissionsResponse> {
    return firstValueFrom(this.authService.GetUserPermissions({ userId }));
  }
}