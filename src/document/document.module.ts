import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from 'src/common/config/config.module';
import { LoggerModule } from 'src/common/logger/logger.module';
import { LoggerService } from 'src/common/logger/logger.service';
import { User } from '../common/entity/user/User.entity';
import { Document } from 'src/common/entity/document/Document.entity';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    LoggerModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Document]),
  ],
  providers: [UserService, DocumentService, LoggerService, JwtService],
  controllers: [DocumentController],
})
export class DocumentModule {}
