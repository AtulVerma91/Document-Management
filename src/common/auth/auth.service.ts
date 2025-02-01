import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from '../entity/User.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from '../dto/login.dto';



@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return argon2.verify(hashedPassword, password);
    }

    async register(createUserDto: CreateUserDto): Promise<{ access_token: string }> {
        const existingUser = await this.userRepository.findOne({ email: createUserDto.email });
        if (existingUser) {
            throw new UnauthorizedException('User already exists');
        }

        const hashedPassword = await argon2.hash(createUserDto.password);

        const user = new User();
        user.email = createUserDto.email;
        user.password = hashedPassword;

        await this.userRepository.save(user);
        return this.generateToken(user);
    }

    async login(loginDto: LoginDto): Promise<{ access_token: string }> {
        const user = await this.userRepository.findOne({ email: loginDto.email });
        if (!user || !(await this.validatePassword(loginDto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user);
    }

    async generateToken(user: User): Promise<{ access_token: string }> {
        const payload = { email: user.email, role: user.role }; 
        this.logger.log(`Token generated for ${user.email}`);
        return { access_token: this.jwtService.sign(payload) };
    }

    async logout(): Promise<{ message: string }> {
        this.logger.log('Logging out...');
        return { message: 'Logged out successfully' };
    }
}
