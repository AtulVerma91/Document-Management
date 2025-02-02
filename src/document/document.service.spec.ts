import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../common/entity/document/Document.entity';
import { User } from '../common/entity/user/User.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('DocumentService', () => {
    let service: DocumentService;
    let documentRepository: Repository<Document>;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DocumentService,
                {
                    provide: getRepositoryToken(Document),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<DocumentService>(DocumentService);
        documentRepository = module.get<Repository<Document>>(getRepositoryToken(Document));
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should throw an error if user is not found', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.create({} as any, 1, {} as any)).rejects.toThrow(
                new HttpException('User not found', HttpStatus.NOT_FOUND),
            );
        });

        it('should create a document successfully', async () => {
            const user = { id: 1 } as User;
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(documentRepository, 'save').mockResolvedValue({} as Document);

            const result = await service.create({ title: 'Test' } as any, 1, { originalname: 'file.txt', buffer: Buffer.from('') } as any);
            expect(result).toBeDefined();
        });
    });

    describe('findAll', () => {
        it('should return an array of documents', async () => {
            const documents = [{ id: 1, title: 'Test' }] as Document[];
            jest.spyOn(documentRepository, 'find').mockResolvedValue(documents);

            expect(await service.findAll()).toEqual(documents);
        });
    });

    describe('findOne', () => {
        it('should return a document if found', async () => {
            const document = { id: 1, title: 'Test' } as Document;
            jest.spyOn(documentRepository, 'findOne').mockResolvedValue(document);

            expect(await service.findOne(1)).toEqual(document);
        });

        it('should throw an error if document is not found', async () => {
            jest.spyOn(documentRepository, 'findOne').mockResolvedValue(null);

            await expect(service.findOne(1)).rejects.toThrow(
                new HttpException('Document not found', HttpStatus.NOT_FOUND),
            );
        });
    });

    describe('update', () => {
        it('should update a document successfully', async () => {
            const document = { id: 1, title: 'Test' } as Document;
            jest.spyOn(service, 'findOne').mockResolvedValue(document);
            jest.spyOn(documentRepository, 'save').mockResolvedValue(document);

            const result = await service.update(1, { title: 'Updated' } as any);
            expect(result.title).toBe('Updated');
        });
    });

    describe('remove', () => {
        it('should remove a document successfully', async () => {
            const document = { id: 1, title: 'Test' } as Document;
            jest.spyOn(service, 'findOne').mockResolvedValue(document);
            jest.spyOn(documentRepository, 'remove').mockResolvedValue(undefined);

            await expect(service.remove(1)).resolves.toBeUndefined();
        });
    });
});
