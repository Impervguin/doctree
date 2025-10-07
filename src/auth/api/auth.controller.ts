import { Controller, Get, Param, UsePipes, ValidationPipe, Post, Body, Put, BadRequestException, Delete, ParseUUIDPipe, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { SignInRequest } from '../services/requests/sign.req';
import { Response } from '@nestjs/common';
import { Response as ExpressResponse, Request as ExpressRequest } from 'express';
import { SetAccessToken, ClearAccessToken } from '../middle/auth.guard';
import { UserNotFoundError } from '../services/errors.service';
import { NoAccessTokenError } from '../middle/errors.guard';
import { RegisterParseSchedulerRequest, RegisterUserRequest } from '../services/requests/register.req';
import { AdminGuard, AppUserGuard } from '../middle/user.guard';

@Controller({
    path: 'auth',
    version: '2'
})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @UsePipes(new ValidationPipe())
    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: SignInRequest, description: 'Login request' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 400, description: 'Incorrect username or password' })
    async login(@Body() req: SignInRequest, @Response() res: ExpressResponse): Promise<void> {
        try {
            const accessToken = await this.authService.signIn(req);
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