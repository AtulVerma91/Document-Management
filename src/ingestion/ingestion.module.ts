import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [IngestionController],
  providers: [IngestionService, JwtService],
})
export class IngestionModule {}
