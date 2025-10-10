import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResetPasswordRequest {
    @IsString()
    @ApiProperty({
        example: '123456',
        description: 'Token',
    })
    token: string;

    @IsString()
    @ApiProperty({
        example: '123456',
        description: 'New password',
    })
    newPassword: string;
}

export class InitResetPasswordRequest {
    @IsString()
    @ApiProperty({
        example: '123456',
        description: 'Username',
    })
    username: string;
}