import { Controller, Post, Get, Param, Body, Patch, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DocumentService } from './document.service';
import { RolesGuard } from '../guard/RoleGuard';
import { Role } from '../guard/roles.enum';
import { Roles } from '../guard/roles.decorator';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { FileInterceptor } from '@nestjs/platform-express'; // For handling file uploads
import { memoryStorage } from 'multer';

@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.Admin, Role.Editor)
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(), 
        limits: { fileSize: 10 * 1024 * 1024 }, 
    })) 
    async createDocument(
        @Body() createDocumentDto: CreateDocumentDto,
        @Param('userId') userId: number,
        @UploadedFile() file: Express.Multer.File 
    ) {
        return this.documentService.create(createDocumentDto, userId, file);
    }

    @Get()
    @UseGuards(RolesGuard)
    async getAllDocuments() {
        return this.documentService.findAll();
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    async getDocument(@Param('id') id: number) {
        return this.documentService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.Admin, Role.Editor)
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
        limits: { fileSize: 10 * 1024 * 1024 },
    })) 
    async updateDocument(
        @Param('id') id: number,
        @Body() updateDocumentDto: UpdateDocumentDto,
        @UploadedFile() file?: Express.Multer.File 
    ) {
        return this.documentService.update(id, updateDocumentDto, file);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    async deleteDocument(@Param('id') id: number) {
        return this.documentService.remove(id);
    }
}
