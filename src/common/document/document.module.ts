import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from '../entity/Document.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { LoggerService } from '../logger/logger.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '../config/config.module';
import { User } from '../entity/User.entity';


@Module({
    imports: [UserModule,ConfigModule, LoggerModule, TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Document])],
    providers: [UserService,DocumentService,LoggerService,JwtService],
    controllers: [DocumentController],
})
export class DocumentModule { }
