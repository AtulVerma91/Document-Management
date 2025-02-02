import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../common/config/config.module';
import { BlacklistedToken } from '../common/entity/blacklisted-token.entity';
import { User } from '../common/entity/user/User.entity';
import { ConfigService } from '../common/config/config.service';
import { LoggerModule } from '../common/logger/logger.module';
import { JwtStrategy } from '../common/jwt/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([User, BlacklistedToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    UserModule,
    LoggerModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
