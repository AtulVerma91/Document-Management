import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { UpdateIngestionDto } from './dto/update-ingestion.dto';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  triggerIngestion() {
    return this.ingestionService.triggerIngestion();
  }

  @Get('status/:id')
  getIngestionStatus(@Param('id') id: string) {
    return this.ingestionService.getIngestionStatus(id);
  }
}
