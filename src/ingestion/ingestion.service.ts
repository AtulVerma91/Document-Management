import { Injectable } from '@nestjs/common';

@Injectable()
export class IngestionService {
  private ingestionProcesses: Record<string, string> = {};

  triggerIngestion(): { message: string; processId: string } {
    const processId = Math.random().toString(36).substring(7);
    this.ingestionProcesses[processId] = 'In Progress';
    return { message: 'Ingestion process started successfully', processId };
  }

  getIngestionStatus(id: string): { processId: string; status: string } {
    const status = this.ingestionProcesses[id] || 'Not Found';
    return { processId: id, status };
  }

  stopIngestion(id: string): {
    message: string;
    processId: string;
    status: string;
  } {
    if (this.ingestionProcesses[id]) {
      this.ingestionProcesses[id] = 'Stopped';
      return {
        message: 'Ingestion process stopped successfully',
        processId: id,
        status: 'Stopped',
      };
    }
    return {
      message: 'Ingestion process not found',
      processId: id,
      status: 'Not Found',
    };
  }

  getAllIngestions(): { message: string; processes: Record<string, string> } {
    return {
      message: 'List of all ingestion processes',
      processes: this.ingestionProcesses,
    };
  }

  getIngestion(id: string): {
    message: string;
    processId: string;
    status: string;
  } {
    const status = this.ingestionProcesses[id] || 'Not Found';
    return {
      message: 'Ingestion process details fetched successfully',
      processId: id,
      status,
    };
  }
}
