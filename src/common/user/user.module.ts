import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../entity/User.entity';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';

@Module({
    imports: [LoggerModule ,TypeOrmModule.forFeature([User])],
    providers: [UserService,LoggerService],
    controllers: [UserController],
})
export class UserModule { }
