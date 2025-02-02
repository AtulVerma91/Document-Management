import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../entity/User.entity';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [LoggerModule ,TypeOrmModule.forFeature([User])],
    providers: [UserService,LoggerService,JwtService],
    controllers: [UserController],
})
export class UserModule { }
