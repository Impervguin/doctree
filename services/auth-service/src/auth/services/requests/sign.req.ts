import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class SignInRequest {
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