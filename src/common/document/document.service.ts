import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { Document } from '../entity/Document.entity';
import { User } from '../entity/User.entity';
import * as path from 'path';
import { promises as fs } from 'fs';
@Injectable()
export class DocumentService {
    private readonly uploadDir = path.resolve(__dirname, '..', '..', 'uploads');

    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Document)
        private documentRepository: Repository<Document>,
    ) { }

    async create(createDocumentDto: CreateDocumentDto, userId: number, file: Express.Multer.File): Promise<Document> {
        const { title,filePath,fileName,fileSize } = createDocumentDto;
        const { originalname, mimetype, size } = file;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        const document = new Document();
        document.title = title;
        document.fileName = file.originalname; 
        document.fileSize = file.size; 
        document.filePath = path.join(this.uploadDir, originalname);
        document.createdBy = user.id;
        document.updatedBy = user.id;

        console.log(this.uploadDir)
        await fs.mkdir(this.uploadDir, { recursive: true });

        await fs.writeFile(document.filePath, file.buffer);
        return this.documentRepository.save(document);
    }

    async findAll(): Promise<Document[]> {
        return this.documentRepository.find();
    }

    async findOne(id: number): Promise<Document> {
        return this.documentRepository.findOne({ where: { id } });
    }

    async update(id: number, updateDocumentDto: UpdateDocumentDto,  file?: Express.Multer.File): Promise<Document> {
        const document = await this.findOne(id);
        const { originalname, mimetype, size } = file;
        if (!document) {
            throw new Error('Document not found');
        }

        const { title } = updateDocumentDto;

        document.title = title || document.title;
        document.fileName = file ? file.originalname : document.fileName; 
        document.fileSize = file ? file.size : document.fileSize; 
        document.updatedBy = 1;
        document.filePath = path.join(this.uploadDir, originalname);
        return this.documentRepository.save(document);
    }

    async remove(id: number): Promise<void> {
        const document = await this.findOne(id);
        if (!document) {
            throw new Error('Document not found');
        }

        await this.documentRepository.remove(document);
    }
}
