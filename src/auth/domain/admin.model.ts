import { IsDate, IsOptional } from "class-validator";
import { AppUser } from "./user.model";
import { ValidateObject } from "src/utils/validate.throw";
import { Type } from "class-transformer";

export class Admin extends AppUser {
    constructor(username: string, passwordHash: string, email: string, grantAt: Date, revokeAt: Date | null, isLocked: boolean, isTempUser: boolean, loginAttempts: number, isTwoFactorEnabled: boolean)
    constructor(username: string, passwordHash: string, email: string, grantAt: Date, revokeAt: Date | null, isLocked: boolean, isTempUser: boolean, loginAttempts: number, isTwoFactorEnabled: boolean, id: string, createdAt: Date, updatedAt: Date, deletedAt: Date | null)
    constructor(username: string, passwordHash: string, email: string, grantAt: Date, revokeAt: Date | null, isLocked: boolean, isTempUser: boolean, loginAttempts: number, isTwoFactorEnabled: boolean, id?: string, createdAt?: Date, updatedAt?: Date, deletedAt?: Date | null) {
        super(username, passwordHash, email, isLocked, isTempUser, loginAttempts, isTwoFactorEnabled, id!, createdAt!, updatedAt!, deletedAt!);
        this.grantAt = grantAt;
        this.revokeAt = revokeAt;
        ValidateObject(this);
    }

    grantAt: Date;

    @IsOptional()
    @IsDate()
    revokeAt: Date | null;

    HaveAdminRights(): boolean {
        return this.revokeAt === null || this.revokeAt < this.grantAt;
    }

    HavePlannerRights(): boolean {
        return this.HaveAdminRights();
    }
}