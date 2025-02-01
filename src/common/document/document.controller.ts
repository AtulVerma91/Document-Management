import { Controller, Post, Get, Param, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RolesGuard } from '../guard/RoleGuard';
import { Role } from '../guard/roles.enum';
import { Roles } from '../guard/roles.decorator';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';


@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Editor) 
    async createDocument(@Body() createDocumentDto: CreateDocumentDto, @Param('userId') userId: number) {
        return this.documentService.create(createDocumentDto, userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllDocuments() {
        return this.documentService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getDocument(@Param('id') id: number) {
        return this.documentService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Editor) 
    async updateDocument(@Param('id') id: number, @Body() updateDocumentDto: UpdateDocumentDto, @Param('userId') userId: number) {
        return this.documentService.update(id, updateDocumentDto, userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin) 
    async deleteDocument(@Param('id') id: number) {
        return this.documentService.remove(id);
    }
}
