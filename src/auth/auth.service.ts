import {
  Injectable,
  UnauthorizedException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { BlacklistedToken } from '../common/entity/blacklisted-token.entity';
import { CreateUserDto } from '../common/dto/user/create-user.dto';
import { User, UserRole } from '../common/entity/user/User.entity';
import { LoginDto } from '../common/dto/login/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(BlacklistedToken)
    private readonly blacklistRepository: Repository<BlacklistedToken>,
  ) {}

  async register(registerUserDto: CreateUserDto) {
    const { email, password, role } = registerUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) throw new ConflictException('Username already taken');

    const user = this.userRepository.create({
      email,
      password,
      role: role as UserRole,
    });
    await this.userRepository.save(user);
    return {
      code: 200,
      message: 'user created successfully',
    };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    
    const hashedPassword = crypto
      .createHash('md5')
      .update(loginDto.email +loginDto.password)
      .digest('hex')
      .toString();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`loginDto.password (plain): ${loginDto.password}`);
    this.logger.log(`user.password (hashed from DB): ${user.password}`);

    const passwordMatch = hashedPassword === user.password;
    this.logger.log(`Password match result: ${passwordMatch}`);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  async generateToken(user: User): Promise<{ access_token: string }> {
    const payload = { email: user.email, role: user.role };
    this.logger.log(`Token generated for ${user.email}`);
    return { access_token: this.jwtService.sign(payload) };
  }

  async logout(token: string): Promise<{ message: string }> {
    this.logger.log('Logging out...');
    const decodedToken = this.jwtService.decode(token) as any;
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const expiryDate = new Date(decodedToken.exp * 1000);

    const blacklistedToken = this.blacklistRepository.create({
      token,
      expiry: expiryDate,
    });
    await this.blacklistRepository.save(blacklistedToken);

    return { message: 'Logged out successfully' };
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.blacklistRepository.findOne({
      where: { token },
    });
    return !!blacklistedToken;
  }
}
