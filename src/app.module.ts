import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './common/config/config.module';
import { ORM_CONFIGS } from './common/config/orm-config';
import { UserModule } from './common/user/user.module';
import { LoggerModule } from './common/logger/logger.module';

import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guard/RoleGuard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from './common/config/config.service';
import * as crypto from 'crypto';
import { AuthModule } from './common/auth/auth.module';
import { DocumentModule } from './common/document/document.module';
import { DocumentService } from './common/document/document.service';
import { User } from './common/entity/User.entity';
import { Document } from './common/entity/Document.entity';

console.log(crypto.randomUUID());


@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Document]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ORM_CONFIGS(configService),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    AuthModule,
    UserModule,
    DocumentModule
  ],
  providers: [
    JwtService,
    DocumentService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }, 
    
  ],
})
export class AppModule { }
