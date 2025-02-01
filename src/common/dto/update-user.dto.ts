import { IsString, IsEmail, IsOptional } from 'class-validator';
import { BaseDto } from './base.dto';

export class UpdateUserDto extends BaseDto{
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;
}
