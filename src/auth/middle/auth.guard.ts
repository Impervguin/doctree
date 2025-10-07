import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ParseCookies } from 'src/utils/parse.cookies';
import { Request, Response } from 'express';
import { User } from '../domain/user.model';
import { NoAccessTokenError } from './errors.guard';



@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = getAccessToken(req);
    if (!token) {
      return false;
    }
    try {
      const user = await this.authService.verifyUser(token);
      setUser(user, req);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export function SetAccessToken(accessToken: string, resp: Response): void {
    resp.cookie('access_token', accessToken, { httpOnly: true, secure: true });
}


export function getAccessToken(req: Request): string | undefined {
    const cookies = ParseCookies(req);
    if ('access_token' in cookies) {
        return cookies['access_token'];
    }
    return undefined;
}

export function ClearAccessToken(req: Request, resp: Response): void {
    const cookies = ParseCookies(req);
    if (!('access_token' in cookies)) {
        throw new NoAccessTokenError("No access token");
    }
    resp.clearCookie('access_token');
}

export function setUser(user: User, req: Request): void {
    req['user'] = user;
}

export function GetUser(req: Request): User | undefined {
    return req['user'];
}