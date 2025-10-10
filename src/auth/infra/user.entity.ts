import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/database/base/base.entity";

@Entity("app_user")
export class UserEntity extends BaseEntity {

    @Column({ name: "username"})
    username: string;

    @Column({ name: "email"})
    email: string;

    @Column({ name: "hash_password"})
    hashPassword: string;

    @Column({ name: "is_two_factor_enabled", default: false })
    isTwoFactorEnabled: boolean;

    @Column({ name: "login_attempts", default: 0 })
    loginAttempts: number;

    @Column({ name: "is_locked", default: false })
    isLocked: boolean;

    @Column({ name: "is_temp_user", default: false })
    isTempUser: boolean;
}

@Entity("app_admin")
export class AdminEntity {
    @PrimaryGeneratedColumn('uuid', { name: "id"})
    id: string;

    @OneToOne(() => UserEntity, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id"})
    user: UserEntity;

    @Column({ name: "grant_at", type: "timestamptz" })
    grantAt: Date;

    @Column({ name: "revoke_at", type: "timestamptz", nullable: true })
    revokeAt: Date | null;
}

@Entity("parse_schedulers")
export class ParseSchedulerEntity extends BaseEntity {
    @Column({ name: "username"})
    username: string;

    @Column({ name: "hash_password"})
    hashPassword: string;
}
