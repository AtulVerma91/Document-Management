import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { LoggerModule } from '../common/logger/logger.module';
import { LoggerService } from '../common/logger/logger.service';
import { User } from '../common/entity/user/User.entity';

@Module({
    imports: [LoggerModule ,TypeOrmModule.forFeature([User])],
    providers: [UserService,LoggerService,JwtService],
    controllers: [UserController],
})
export class UserModule { }
