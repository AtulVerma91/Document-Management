import { IsOptional, IsString, IsInt } from 'class-validator';
import { BaseDto } from '../base.dto';

export class UpdateDocumentDto extends BaseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  filePath?: string;

  @IsOptional()
  @IsInt()
  fileSize?: number;
}
