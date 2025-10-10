import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class LoginRequest {
    @IsString()
    @ApiProperty({
        example: 'admin',
        description: 'Username',
    })
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '123456',
        description: 'Password',
    })
    password: string;
}

export class Login2FARequest {
    @IsString()
    @ApiProperty({
        example: 'dasdqwacssqwrhgem,231241',
        description: '2fa token',
    })
    token: string;
}