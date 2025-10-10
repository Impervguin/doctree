import { Controller, Get, Param, UsePipes, ValidationPipe, Post, Body, Put, BadRequestException, Delete, ParseUUIDPipe, Request, UseGuards, NotAcceptableException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiParam, ApiProperty } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginRequest, Login2FARequest } from '../services/requests/sign.req';
import { Response } from '@nestjs/common';
import { Response as ExpressResponse, Request as ExpressRequest } from 'express';
import { SetAccessToken, ClearAccessToken, GetUser } from '../middle/auth.guard';
import { IncorrectPasswordError, Need2FAError, UserLockedError, UserNotFoundError } from '../services/errors.service';
import { NoAccessTokenError } from '../middle/errors.guard';
import { RegisterParseSchedulerRequest, RegisterUserRequest } from '../services/requests/register.req';
import { AdminGuard, AppUserGuard } from '../middle/user.guard';
import { IsString } from 'class-validator';
import { InitResetPasswordRequest, ResetPasswordRequest } from '../services/requests/reset.req';

export class TestMailRequest {
    @ApiProperty()
    @IsString()
    text: string;
}

@Controller({
    path: 'auth',
    version: '2'
})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: LoginRequest, description: 'Login request' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 202, description: '2fa required' })
    @ApiResponse({ status: 400, description: 'Incorrect username or password' })
    async login(@Body() req: LoginRequest, @Response() res: ExpressResponse): Promise<void> {
        try {
            const accessToken = await this.authService.login(req);
            SetAccessToken(accessToken, res);
            res.send();
        } catch (e) {
            if (e instanceof UserNotFoundError) {
                throw new BadRequestException(e.message);
            } else if (e instanceof Need2FAError) {
                res.sendStatus(202);
                return;
            } else if (e instanceof UserLockedError) {
                throw new NotAcceptableException(e.message);
            } else if (e instanceof IncorrectPasswordError) {
                throw new BadRequestException(e.message);
            } else {
                throw e;
            }
        }
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout' })
    @ApiResponse({ status: 200, description: 'Logout successful' })
    @ApiResponse({ status: 401, description: 'No access token (Unauthorized)' })
    async logout(@Request() req: ExpressRequest, @Response() res: ExpressResponse): Promise<void> {
        try {
            ClearAccessToken(req, res);
            res.sendStatus(200);
        } catch (e) {
            if (e instanceof NoAccessTokenError) {
                res.sendStatus(401);
            }
        }
    }

    @Post('login2fa')
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Login with 2fa' })
    @ApiBody({ type: Login2FARequest, description: 'Login request' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 400, description: 'Incorrect token' })
    async login2fa(@Body() req: Login2FARequest, @Response() res: ExpressResponse): Promise<void> {
        try {
            const accessToken = await this.authService.login2FA(req);
            SetAccessToken(accessToken, res);
            res.send();
        } catch (e) {
            if (e instanceof UserNotFoundError) {
                throw new BadRequestException(e.message);
            } else {
                throw e;
            }
        }
    }

    @Post('enable2fa')
    @UseGuards(AppUserGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Enable 2fa' })
    @ApiResponse({ status: 200, description: '2fa enabled' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async enable2fa(@Request() req: ExpressRequest, @Response() res: ExpressResponse): Promise<void> {
        try {
            const user = GetUser(req);
            await this.authService.enable2FA(user!);
            res.send();
        } catch (e) {
            if (e instanceof Error) {
                throw new BadRequestException(e.message);
            } else {
                throw e;
            }
        }
    }

    @Post('initreset')
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Init reset password' })
    @ApiBody({ type: InitResetPasswordRequest, description: 'Init reset password request' })
    @ApiResponse({ status: 200, description: 'Reset password inited' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async initResetPassword(@Body() req: InitResetPasswordRequest, @Response() res: ExpressResponse): Promise<void> {
        try {
            await this.authService.sendResetPassword(req.username);
            res.send();
        } catch (e) {
            if (e instanceof UserNotFoundError) {
                throw new BadRequestException(e.message);
            } else {
                throw e;
            }
        }
    }

    @Post('reset')
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Reset password' })
    @ApiBody({ type: ResetPasswordRequest, description: 'Reset password request' })
    @ApiResponse({ status: 200, description: 'Password reseted' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async resetPassword(@Body() req: ResetPasswordRequest, @Response() res: ExpressResponse): Promise<void> {
        try {
            await this.authService.resetPassword(req);
            res.send();
        } catch (e) {
            if (e instanceof Error) {
                throw new BadRequestException(e.message);
            } else {
                throw e;
            }
        }
    }

    @Post('register')
    @UseGuards(AdminGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Register user' })
    @ApiResponse({ status: 201, description: 'User registered' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async registerUser(@Body() req: RegisterUserRequest): Promise<void> {
        await this.authService.registerUser(req);
    }

    @Post('scheduler')
    @UseGuards(AdminGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Register parse scheduler' })
    @ApiResponse({ status: 201, description: 'Parse scheduler registered' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async registerParseScheduler(@Body() req: RegisterParseSchedulerRequest): Promise<void> {
        await this.authService.registerParseScheduler(req);
    }
}
