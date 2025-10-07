import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../infra/interface.repository';
import * as bcrypt from 'bcrypt';
import { IncorrectPasswordError, UserNotFoundError, NotIdError, UnauthorizedError } from './errors.service';
import { isUUID } from 'class-validator';
import { AppUser, User } from '../domain/user.model';
import { SignInRequest } from './requests/sign.req';
import { RegisterParseSchedulerRequest, RegisterUserRequest } from './requests/register.req';
import { Planner } from '../domain/planner.model';


class UserPayload {
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
) {}
  async signIn(req: SignInRequest): Promise<string> {
    const user = await this.authRepository.getUser(req.username);
    if (!user) {
      throw new UserNotFoundError('User not found');
    }
    const isPasswordCorrect = await bcrypt.compare(req.password, user.passwordHash);
    if (!isPasswordCorrect) {
      throw new IncorrectPasswordError('Incorrect password');
    }
    const payload = new UserPayload();
    payload.id = user.id;

    return this.jwtService.signAsync({ id: user.id });
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
    const user = new AppUser(req.username, req.password, req.email);
    await this.authRepository.createUser(user);
  }
  async registerParseScheduler(req: RegisterParseSchedulerRequest): Promise<void> {
    const planner = new Planner(req.username, req.password);
    await this.authRepository.createPlanner(planner);
  }
}