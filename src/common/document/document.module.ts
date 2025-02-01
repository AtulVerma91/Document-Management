import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from '../entity/Document.entity';
import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule,TypeOrmModule.forFeature([Document])],
    providers: [DocumentService],
    controllers: [DocumentController],
})
export class DocumentModule { }
