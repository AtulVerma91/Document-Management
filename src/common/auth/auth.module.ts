import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/User.entity';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { LoggerModule } from '../logger/logger.module';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { BlacklistedToken } from '../entity/blacklisted-token.entity';


@Module({
    imports: [ConfigModule,
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
export class AuthModule { }