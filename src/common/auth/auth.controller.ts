import { Controller, Post, Body, Req, Res, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private readonly authService: AuthService) { }

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

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<{ code: number; message: string; }> {
        return this.authService.register(createUserDto);
    }

    // Logout method
    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
        res.clearCookie('access_token');
        res.status(200).send({ message: 'Logged out successfully' });
    }
}
