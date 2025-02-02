import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { BaseDto } from '../base.dto';

export class CreateUserDto extends BaseDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
