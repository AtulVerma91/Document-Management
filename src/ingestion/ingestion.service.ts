import { Injectable } from '@nestjs/common';

@Injectable()
export class IngestionService {
  private ingestionProcesses: Record<string, string> = {};

  triggerIngestion(): { message: string; processId: string } {
    const processId = Math.random().toString(36).substring(7);
    this.ingestionProcesses[processId] = 'In Progress';
    return { message: 'Ingestion triggered', processId };
  }

  getIngestionStatus(id: string): { processId: string; status: string } {
    const status = this.ingestionProcesses[id] || 'Not Found';
    return { processId: id, status };
  }
}
