import { IsString, IsInt, IsNotEmpty } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateDocumentDto extends BaseDto {
    @IsNotEmpty()
    @IsString()
    title?: string;
    
    @IsNotEmpty()
    @IsString()
    fileName?: string;

    @IsNotEmpty()
    @IsInt()
    fileSize?: number;
}
