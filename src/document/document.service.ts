import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import { promises as fs } from 'fs';
import { Document } from '../common/entity/document/Document.entity';
import { User } from '../common/entity/user/User.entity';
import { CreateDocumentDto } from '../common/dto/document/create-document.dto';
import { UpdateDocumentDto } from '../common/dto/document/update-document.dto';

@Injectable()
export class DocumentService {
    private readonly uploadDir = path.resolve(__dirname, '..', '..', 'uploads');

    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Document)
        private documentRepository: Repository<Document>,
    ) { }

    async create(
        createDocumentDto: CreateDocumentDto,
        userId: number,
        file: Express.Multer.File,
    ): Promise<Document> {
        const { title, filePath, fileName, fileSize } = createDocumentDto;
        const { originalname, mimetype, size } = file;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const document = new Document();
        document.title = title;
        document.fileName = file.originalname;
        document.fileSize = file.size;
        document.filePath = path.join(this.uploadDir, originalname);
        document.createdBy = user.id;
        document.updatedBy = user.id;

        try {
            console.log(this.uploadDir);
            await fs.mkdir(this.uploadDir, { recursive: true });

            await fs.writeFile(document.filePath, file.buffer);
            return this.documentRepository.save(document);
        } catch (error) {
            throw new HttpException('File storage error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(): Promise<Document[]> {
        return this.documentRepository.find();
    }

    async findOne(id: number): Promise<Document> {
        const document = await this.documentRepository.findOne({ where: { id } });
        if (!document) {
            throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
        }
        return document;
    }

    async update(
        id: number,
        updateDocumentDto: UpdateDocumentDto,
        file?: Express.Multer.File,
    ): Promise<Document> {
        const document = await this.findOne(id);
        if (!document) {
            throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
        }

        const { title } = updateDocumentDto;
        document.title = title || document.title;
        if (file) {
            document.fileName = file.originalname;
            document.fileSize = file.size;
            document.filePath = path.join(this.uploadDir, file.originalname);
        }
        document.updatedBy = 1; 

        try {
            return await this.documentRepository.save(document);
        } catch (error) {
            throw new HttpException('Error updating document', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(id: number): Promise<void> {
        const document = await this.findOne(id);
        if (!document) {
            throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
        }

        try {
            await this.documentRepository.remove(document);
        } catch (error) {
            throw new HttpException('Error removing document', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
