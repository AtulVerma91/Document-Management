import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { Roles } from '../common/guard/roles.decorator';
import { RolesGuard } from '../common/guard/RoleGuard';
import { Role } from '../common/guard/roles.enum';

@Controller('ingestion')
@UseGuards(RolesGuard)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @Roles(Role.Admin)
  triggerIngestion() {
    return this.ingestionService.triggerIngestion();
  }

  @Get('status/:id')
  getIngestionStatus(@Param('id') id: string) {
    return this.ingestionService.getIngestionStatus(id);
  }

  @Post('stop/:id')
  @Roles(Role.Admin)
  stopIngestion(@Param('id') id: string) {
    return this.ingestionService.stopIngestion(id);
  }

  @Get('all')
  @Roles(Role.Admin)
  getAllIngestions() {
    return this.ingestionService.getAllIngestions();
  }

  @Get(':id')
  getIngestion(@Param('id') id: string) {
    return this.ingestionService.getIngestion(id);
  }
}
