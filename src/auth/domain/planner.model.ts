import { IsString } from "class-validator";
import { BaseModel } from "src/base/base.model";
import { ValidateObject } from "src/utils/validate.throw";


export class Planner extends BaseModel {
    constructor(username: string, passwordHash: string)
    constructor(username: string, passwordHash: string, id: string, createdAt: Date, updatedAt: Date, deletedAt: Date | null)
    constructor(username: string, passwordHash: string, id?: string, createdAt?: Date, updatedAt?: Date, deletedAt?: Date | null) {
        super(id!, createdAt!, updatedAt!, deletedAt!);
        this.username = username;
        this.passwordHash = passwordHash;
        ValidateObject(this);
    }

    @IsString()
    username: string;

    @IsString()
    passwordHash: string;

    HaveAdminRights(): boolean {
        return false;
    }

    HavePlannerRights(): boolean {
        return true;
    }
    
    HaveAppUserRights(): boolean {
        return false;
    }
}