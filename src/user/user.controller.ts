import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Logger, Request, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from '../common/guard/RoleGuard';
import { Roles } from '../common/guard/roles.decorator';
import { Role } from '../common/guard/roles.enum';
import { UserRole } from '../common/entity/user/User.entity';

@Controller('users')

export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private userService: UserService) { }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    async getAllUsers(@Request() req) {
        this.logger.log('Fetching all users');
        return this.userService.getAllUsers();
    }
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
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
    @Roles(Role.Admin)
    async updateUser(@Param('id') id: number, @Body('role') role: UserRole, @Request() req) {
        const userId = req.user?.id; 
        return this.userService.updateUser(id, role, userId);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    async deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id);
    }
}
