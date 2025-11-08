import { AppUser } from "../domain/user.model";
import { Admin } from "../domain/admin.model";
import { Planner } from "../domain/planner.model";
import { UserEntity, AdminEntity, ParseSchedulerEntity } from "./user.entity";

export class UserMapper {
    static toEntity(user: AppUser): UserEntity {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            hashPassword: user.passwordHash,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        };
    }

    static toDomain(user: UserEntity): AppUser {
        return new AppUser(user.username, user.hashPassword, user.email, user.id, user.createdAt, user.updatedAt, user.deletedAt);
    }
}

export class AdminMapper {
    static toEntity(admin: Admin): AdminEntity {
        return {
            id: admin.id,
            user: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                hashPassword: admin.passwordHash,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt,
                deletedAt: admin.deletedAt,
            },
            grantAt: admin.grantAt,
            revokeAt: admin.revokeAt,
            }
        };
    static toDomain(admin: AdminEntity): Admin {
        return new Admin(admin.user.username, admin.user.hashPassword, admin.user.email, admin.grantAt, admin.revokeAt, admin.id, admin.user.createdAt, admin.user.updatedAt, admin.user.deletedAt);
    }
}

export class ParseSchedulerMapper {
    static toEntity(scheduler: Planner): ParseSchedulerEntity {
        return {
            id: scheduler.id,
            username: scheduler.username,
            hashPassword: scheduler.passwordHash,
            createdAt: scheduler.createdAt,
            updatedAt: scheduler.updatedAt,
            deletedAt: scheduler.deletedAt,
        };
    }

    static toDomain(scheduler: ParseSchedulerEntity): Planner {
        return new Planner(scheduler.username, scheduler.hashPassword, scheduler.id, scheduler.createdAt, scheduler.updatedAt, scheduler.deletedAt);
    }
}