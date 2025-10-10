import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../infra/interface.repository';
import * as bcrypt from 'bcrypt';
import { IncorrectPasswordError, UserNotFoundError, NotIdError, UnauthorizedError, Wrong2FACodeError, UserLockedError, Need2FAError, WrongResetPasswordTokenError } from './errors.service';
import { isUUID } from 'class-validator';
import { AppUser, User } from '../domain/user.model';
import { Login2FARequest, LoginRequest } from './requests/sign.req';
import { RegisterParseSchedulerRequest, RegisterUserRequest } from './requests/register.req';
import { Planner } from '../domain/planner.model';
import { TwoFaSender } from '../2fa/services/abstract.service';
import { ResetPasswordRequest } from './requests/reset.req';

class UserPayload {
  id: string;

  toJSON(): object {
    return {
      id: this.id,
    };
  }
}

class ResetPasswordPayload {
  id: string;

  resetPassword: true;

  toJSON(): object {
    return {
      id: this.id,
      resetPassword: this.resetPassword,
    };
  }
}

@Injectable()
export class AuthService {
  static MaxLoginAttempts = 3;
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly twoFaSender: TwoFaSender,
) {}
  private async signIn(user: User): Promise<string> {
    const payload = new UserPayload();
    payload.id = user.id;

    return this.jwtService.signAsync(payload.toJSON());
  }

  async login(req: LoginRequest): Promise<string> {
    const user = await this.authRepository.getUser(req.username);
    if (!user) {
        throw new UserNotFoundError('User not found');
    }
    if (user instanceof AppUser) {
        if (user.isLocked) {
          throw new UserLockedError('User is locked');
        }
    }

    const isPasswordCorrect = await bcrypt.compare(req.password, user.passwordHash); 
    if (!isPasswordCorrect) {
      if (user instanceof AppUser) {
        user.loginAttempts++;
        if (user.loginAttempts >= AuthService.MaxLoginAttempts) {
          user.isLocked = true;
        }
        await this.authRepository.updateUser(user);
      }
      throw new IncorrectPasswordError('Incorrect password');
    }

    if (user instanceof AppUser) {
        await this.resetLoginAttempts(user);
        if (user.isTwoFactorEnabled) {
            await this.send2FA(user);
            throw new Need2FAError('Sent 2fa');
        }
    }
    return this.jwtService.signAsync({ id: user.id });
  }

  async send2FA(user: AppUser): Promise<void> {
    const payload = new UserPayload();
    payload.id = user.id;
    const jwt = await this.jwtService.signAsync(payload.toJSON());
    await this.twoFaSender.send(user, jwt);
  }

  async resetLoginAttempts(user: AppUser): Promise<void> {
    user.loginAttempts = 0;
    user.isLocked = false;
    await this.authRepository.updateUser(user);
  }

  async enable2FA(user: User): Promise<void> {
    if (user instanceof AppUser) {
        user.isTwoFactorEnabled = true;
        await this.authRepository.updateUser(user);
    } else {
        throw new Error('Not app user');
    }
  }

  async login2FA(req: Login2FARequest): Promise<string> {
    var payload: UserPayload;
    try {
        payload = await this.jwtService.verifyAsync<UserPayload>(req.token);
    } catch (e) {
        throw new Wrong2FACodeError('Wrong 2fa code');
    }
    if (isUUID(payload.id) === false) {
        throw new NotIdError('Id is not uuid');
    }
    const user = await this.authRepository.getUserById(payload.id);
    if (!user) {
        throw new UserNotFoundError('User not found');
    }
    return this.signIn(user);
  }

  async sendResetPassword(username: string): Promise<void> {
    const user = await this.authRepository.getUser(username);
    if (!user) {
        throw new UserNotFoundError('User not found');
    }
    if (!(user instanceof AppUser)) {
        throw new Error('Not app user');
    }

    const payload = new ResetPasswordPayload();
    payload.id = user.id;
    payload.resetPassword = true;
    const jwt = await this.jwtService.signAsync(payload.toJSON());
    await this.twoFaSender.sendResetPassword(user, jwt);
  }

  async resetPassword(req: ResetPasswordRequest): Promise<void> {
    var payload: ResetPasswordPayload;
    try {
        payload = await this.jwtService.verifyAsync<ResetPasswordPayload>(req.token);
    } catch (e) {
        throw new WrongResetPasswordTokenError('Wrong reset password token');
    }
    if (payload.resetPassword !== true) {
        throw new WrongResetPasswordTokenError('Wrong reset password token');
    }
    console.log(payload);
    if (isUUID(payload.id) === false) {
        throw new NotIdError('Id is not uuid');
    }
    const user = await this.authRepository.getUserById(payload.id);
    if (!user || !(user instanceof AppUser)) {
        throw new UserNotFoundError('User not found');
    }
    
    this.resetLoginAttempts(user);
    user.passwordHash = await bcrypt.hash(req.newPassword, 10);
    
    await this.authRepository.updateUser(user);
  }
  async verifyUser(accessToken: string): Promise<User> {
    var payload: UserPayload;
    try {
        payload = await this.jwtService.verifyAsync<UserPayload>(accessToken);
    } catch (e) {
        throw new UnauthorizedError('JWT Unauthorized');
    }
    if (isUUID(payload.id) === false) {
        throw new NotIdError('Id is not uuid');
    }
    const user = await this.authRepository.getUserById(payload.id);
    if (!user) {
        throw new UserNotFoundError('User not found');
    }
    return user;
  }

  async registerUser(req: RegisterUserRequest): Promise<void> {
    const user = new AppUser(req.username, req.password, req.email, false, false, 0, false);
    await this.authRepository.createUser(user);
  }
  async registerParseScheduler(req: RegisterParseSchedulerRequest): Promise<void> {
    const planner = new Planner(req.username, req.password);
    await this.authRepository.createPlanner(planner);
  }
}