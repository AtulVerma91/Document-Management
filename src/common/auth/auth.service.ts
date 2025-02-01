import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private jwtService: JwtService) { }

    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return argon2.verify(hashedPassword, password);
    }

    async generateToken(user) {
        const payload = { email: user.email, role: user.role };
        this.logger.log(`Token generated for ${user.email}`);
        return { access_token: this.jwtService.sign(payload) };
    }
}
