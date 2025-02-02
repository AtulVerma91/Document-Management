import { IsInt } from 'class-validator';

export class DeleteDocumentDto {
  @IsInt()
  id: number;
}
