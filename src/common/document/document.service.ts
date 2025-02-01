import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { Document } from '../entity/Document.entity';
import { User } from '../entity/User.entity';

@Injectable()
export class DocumentService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Document)
        private documentRepository: Repository<Document>,
        
    ) { }

    async create(createDocumentDto: CreateDocumentDto, userId: number): Promise<Document> {
        const { title, fileName, fileSize } = createDocumentDto; 

        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new Error('User not found');
        }

        const document = new Document(); 
        document.title = title;
        document.fileName = fileName;
        document.fileSize = fileSize;
        document.createdBy = user.id;
        document.updatedBy = user.id;

        return this.documentRepository.save(document);
    }

    
    async findAll(): Promise<Document[]> {
        return this.documentRepository.find();
    }

   
    async findOne(id: number): Promise<Document> {
        return this.documentRepository.findOne({ where: { id } });
    }

    
    async update(id: number, updateDocumentDto: UpdateDocumentDto, userId: number): Promise<Document> {
        const document = await this.findOne(id);
        if (!document) {
            throw new Error('Document not found');
        }

        const { title, fileName, fileSize } = updateDocumentDto;

        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new Error('User not found');
        }

        document.title = title || document.title;
        document.fileName = fileName || document.fileName;
        document.fileSize = fileSize || document.fileSize;
        document.updatedBy = user.id;

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
