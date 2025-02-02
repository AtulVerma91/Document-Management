import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from '../common/dto/document/create-document.dto';
import { UpdateDocumentDto } from '../common/dto/document/update-document.dto';
import { RolesGuard } from '../common/guard/RoleGuard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;

  const mockDocumentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockToken'),
    verify: jest.fn().mockReturnValue({ role: 'admin' }), // Mock the verify method
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockDocumentService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        Reflector,
        {
          provide: RolesGuard,
          useValue: {
            canActivate: jest.fn((context: ExecutionContext) => true),
          },
        },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDocument', () => {
    it('should call service.create with correct parameters', async () => {
      const createDocumentDto: CreateDocumentDto = {
        title: 'Test',
        fileName: 'file.txt',
        filePath: '/path/to/file',
        fileSize: 1234,
        createdBy: 1,
        updatedBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const userId = 1;
      const file = {
        originalname: 'file.txt',
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      await controller.createDocument(createDocumentDto, userId, file);
      expect(service.create).toHaveBeenCalledWith(
        createDocumentDto,
        userId,
        file,
      );
    });
  });

  describe('getAllDocuments', () => {
    it('should call service.findAll', async () => {
      await controller.getAllDocuments();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getDocument', () => {
    it('should call service.findOne with correct id', async () => {
      const id = 1;
      await controller.getDocument(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('updateDocument', () => {
    it('should call service.update with correct parameters', async () => {
      const id = 1;
      const updateDocumentDto: UpdateDocumentDto = {
        title: 'Updated',
        createdBy: 1,
        updatedBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const file = {
        originalname: 'file.txt',
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      await controller.updateDocument(id, updateDocumentDto, file);
      expect(service.update).toHaveBeenCalledWith(id, updateDocumentDto, file);
    });
  });

  describe('deleteDocument', () => {
    it('should call service.remove with correct id', async () => {
      const id = 1;
      await controller.deleteDocument(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
