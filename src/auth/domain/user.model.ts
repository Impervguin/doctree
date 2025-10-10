import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { BaseModel } from "src/base/base.model";
import { ValidateObject } from "src/utils/validate.throw";

export class AppUser extends BaseModel {
    constructor(username: string, passwordHash: string, email: string, isLocked: boolean, isTempUser: boolean, loginAttempts: number, isTwoFactorEnabled: boolean)
    constructor(username: string, passwordHash: string, email: string, isLocked: boolean, isTempUser: boolean, loginAttempts: number, isTwoFactorEnabled: boolean, id: string, createdAt: Date, updatedAt: Date, deletedAt: Date | null)
    constructor(username: string, passwordHash: string, email: string, isLocked: boolean, isTempUser: boolean, loginAttempts: number, isTwoFactorEnabled: boolean, id?: string, createdAt?: Date, updatedAt?: Date, deletedAt?: Date | null) {
        super(id!, createdAt!, updatedAt!, deletedAt!);
        this.username = username;
        this.passwordHash = passwordHash;
        this.email = email;
        this.isLocked = isLocked!;
        this.isTempUser = isTempUser!;
        this.loginAttempts = loginAttempts!;
        this.isTwoFactorEnabled = isTwoFactorEnabled!;
        ValidateObject(this);
    }

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    passwordHash: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsBoolean()
    isTwoFactorEnabled: boolean;

    @IsNumber()
    loginAttempts: number;

    @IsBoolean()
    isLocked: boolean;

    @IsBoolean()
    isTempUser: boolean;

    HaveAdminRights(): boolean {
        return false;
    }

    HavePlannerRights(): boolean {
        return false;
    }

    HaveAppUserRights(): boolean {
        return true;
    }
}



export interface User {
    id: string;
    username: string;
    passwordHash: string;
    HaveAdminRights(): boolean;
    HavePlannerRights(): boolean;
    HaveAppUserRights(): boolean;
}