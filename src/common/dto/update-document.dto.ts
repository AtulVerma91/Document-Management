import { IsString, IsInt, IsOptional } from 'class-validator';
import { BaseDto } from './base.dto';

export class UpdateDocumentDto extends BaseDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    fileName?: string;

    @IsOptional()
    @IsInt()
    fileSize?: number;
}
