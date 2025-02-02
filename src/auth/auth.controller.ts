import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Logger,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { Public } from '../common/guard/public.decorator';
import { CreateUserDto } from '../common/dto/user/create-user.dto';
import { LoginDto } from '../common/dto/login/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    const { access_token } = await this.authService.login(loginDto);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 1000, // 1 hour
    });

    res.status(200).send({ message: 'Login successful' });
  }
  @Public()
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ code: number; message: string }> {
    return this.authService.register(createUserDto);
  }

  @Post('logout')
  async logout(
    @Headers('Authorization') authHeader: string,
    @Res() res: Response,
  ) {
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new Error('Token not provided');
    }
    return this.authService.logout(token);
  }
}
