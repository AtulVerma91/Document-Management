import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';

describe('IngestionService', () => {
  let service: IngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngestionService],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
  });

  it('should trigger an ingestion process', () => {
    const result = service.triggerIngestion();
    expect(result).toHaveProperty(
      'message',
      'Ingestion process started successfully',
    );
    expect(result).toHaveProperty('processId');
  });

  it('should return ingestion status', () => {
    const process = service.triggerIngestion();
    const status = service.getIngestionStatus(process.processId);
    expect(status).toEqual({
      processId: process.processId,
      status: 'In Progress',
    });
  });

  it('should stop an ingestion process', () => {
    const process = service.triggerIngestion();
    const stopResult = service.stopIngestion(process.processId);
    expect(stopResult).toEqual({
      message: 'Ingestion process stopped successfully',
      processId: process.processId,
      status: 'Stopped',
    });
  });
});
