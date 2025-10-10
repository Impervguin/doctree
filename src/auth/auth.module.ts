import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./services/auth.service";
import { AuthRepository } from "./infra/interface.repository";
import { PostgresAuthRepository } from "./infra/postgres.repository";
import { AuthGuard } from "./middle/auth.guard";
import { AdminGuard, PlannerGuard } from "./middle/user.guard";
import { AuthController } from "./api/auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity, ParseSchedulerEntity, UserEntity } from "./infra/user.entity";
import { TwoFaModule } from "./2fa/mail.module";



@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.getOrThrow("JWT_SECRET"),
                signOptions: {
                    expiresIn: configService.getOrThrow('JWT_EXPIRES_IN'),
                },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([UserEntity, AdminEntity, ParseSchedulerEntity]),
        TwoFaModule,
    ],
    providers: [
        AuthService, 
        {
            provide: AuthRepository,
            useClass: PostgresAuthRepository,
        },
        AuthGuard,
        AdminGuard,
        PlannerGuard,
    ],
    controllers: [AuthController],
    exports: [AuthService, AuthGuard, AdminGuard, PlannerGuard],

})
export class AuthModule {}