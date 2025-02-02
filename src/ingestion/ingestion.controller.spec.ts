import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { RolesGuard } from '../common/guard/RoleGuard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  const mockIngestionService = {
    triggerIngestion: jest.fn().mockReturnValue({ message: 'Ingestion process started successfully', processId: '123' }),
    getIngestionStatus: jest.fn().mockReturnValue({ processId: '123', status: 'In Progress' }),
    stopIngestion: jest.fn().mockReturnValue({ message: 'Ingestion process stopped successfully', processId: '123', status: 'Stopped' }),
    getAllIngestions: jest.fn().mockReturnValue({ message: 'List of all ingestion processes', processes: {} }),
    getIngestion: jest.fn().mockReturnValue({ message: 'Ingestion process details fetched successfully', processId: '123', status: 'In Progress' }),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockToken'),
    verify: jest.fn().mockReturnValue({ role: 'admin' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: mockIngestionService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        Reflector,
        {
          provide: RolesGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('triggerIngestion', () => {
    it('should trigger ingestion via controller', () => {
      const result = controller.triggerIngestion();
      expect(result).toEqual({ message: 'Ingestion process started successfully', processId: '123' });
      expect(service.triggerIngestion).toHaveBeenCalled();
    });
  });

  describe('getIngestionStatus', () => {
    it('should get ingestion status via controller', () => {
      const status = controller.getIngestionStatus('123');
      expect(status).toEqual({ processId: '123', status: 'In Progress' });
      expect(service.getIngestionStatus).toHaveBeenCalledWith('123');
    });
  });

  describe('stopIngestion', () => {
    it('should stop ingestion via controller', () => {
      const stopResult = controller.stopIngestion('123');
      expect(stopResult).toEqual({ message: 'Ingestion process stopped successfully', processId: '123', status: 'Stopped' });
      expect(service.stopIngestion).toHaveBeenCalledWith('123');
    });
  });

  describe('getAllIngestions', () => {
    it('should get all ingestions via controller', () => {
      const result = controller.getAllIngestions();
      expect(result).toEqual({ message: 'List of all ingestion processes', processes: {} });
      expect(service.getAllIngestions).toHaveBeenCalled();
    });
  });

  describe('getIngestion', () => {
    it('should get ingestion details via controller', () => {
      const result = controller.getIngestion('123');
      expect(result).toEqual({ message: 'Ingestion process details fetched successfully', processId: '123', status: 'In Progress' });
      expect(service.getIngestion).toHaveBeenCalledWith('123');
    });
  });
});
