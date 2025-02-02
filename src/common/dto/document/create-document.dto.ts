import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { BaseDto } from '../base.dto';


export class CreateDocumentDto extends BaseDto {
    @IsNotEmpty()
    @IsString()
    title?: string;

    @IsNotEmpty()
    @IsString()
    fileName?: string;  

    @IsNotEmpty()
    @IsString()
    filePath?: string; 

    @IsNotEmpty()
    @IsInt()
    fileSize?: number;  
}
