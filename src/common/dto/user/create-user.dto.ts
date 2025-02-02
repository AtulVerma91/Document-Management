import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { BaseDto } from '../base.dto';

export class CreateUserDto extends BaseDto{
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
