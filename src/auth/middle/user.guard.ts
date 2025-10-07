import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard, GetUser } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { console } from 'inspector';

export class AdminGuard extends AuthGuard {
    constructor(authService: AuthService) {
        super(authService);
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const res = await super.canActivate(context);
        if (!res) {
            return false;
        }
        const user = GetUser(context.switchToHttp().getRequest());
        if (!user) {
            return false;
        }
        console.log(user);
        return user.HaveAdminRights();
    }
}

export class PlannerGuard extends AuthGuard {
    constructor(authService: AuthService) {
        super(authService);
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const res = await super.canActivate(context);
        if (!res) {
            return false;
        }
        const user = GetUser(context.switchToHttp().getRequest());
        if (!user) {
            return false;
        }
        return user.HavePlannerRights();
    }
}

export class AppUserGuard extends AuthGuard {
    constructor(authService: AuthService) {
        super(authService);
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const res = await super.canActivate(context);
        if (!res) {
            return false;
        }
        const user = GetUser(context.switchToHttp().getRequest());
        if (!user) {
            return false;
        }
        return user.HaveAppUserRights();
    }
}