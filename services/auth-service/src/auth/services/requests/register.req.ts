import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class RegisterUserRequest {
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

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'aaaa@something.com',
        description: 'User email',
    })
    email: string;
}

export class RegisterParseSchedulerRequest {
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