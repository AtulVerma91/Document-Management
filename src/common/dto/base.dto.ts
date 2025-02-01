import { IsOptional, IsString, IsInt, IsDate, IsNumber } from 'class-validator';

export class BaseDto {
    @IsOptional()
    @IsInt()
    createdBy: number;

    @IsOptional()
    @IsInt()
    updatedBy: number;

    @IsOptional()
    @IsDate()
    createdAt: Date;

    @IsOptional()
    @IsDate()
    updatedAt: Date; 

    @IsOptional()
    @IsString()
    description?: string; 
}
