import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Logger, Request, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from '../guard/RoleGuard';
import { UserRole } from '../entity/User.entity';


@Controller('users')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private userService: UserService) { }

    @Get()
    @UseGuards(RolesGuard)
    @SetMetadata('roles', ['admin'])
    async getAllUsers(@Request() req) {
        this.logger.log('Fetching all users');
        return this.userService.getAllUsers();
    }

    @Get(':id')
    async getUser(@Param('id') id: number) {
        return this.userService.getUserById(id);
    }

    @Post()
    async createUser(@Body() body: { email: string, password: string, role: UserRole }, @Request() req) {
        const userId = req.user?.id;
        return this.userService.createUser(body.email, body.password, body.role, userId);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @SetMetadata('roles', ['admin'])
    async updateUser(@Param('id') id: number, @Body('role') role: UserRole, @Request() req) {
        const userId = req.user?.id; 
        return this.userService.updateUser(id, role, userId);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @SetMetadata('roles', ['admin'])
    async deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id);
    }
}
