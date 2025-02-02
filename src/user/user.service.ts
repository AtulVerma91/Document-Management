import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '../common/logger/logger.service';
import { User, UserRole } from '../common/entity/user/User.entity';

@Injectable()
export class UserService {
    private readonly logger: LoggerService;
    constructor(@InjectRepository(User) private userRepo: Repository<User>) { }

    async getAllUsers() {
        return this.userRepo.find();
    }

    async getUserById(id: number) {
        return this.userRepo.findOne({ where: { id } });
    }

    async createUser(email: string, password: string, role: UserRole, userId: number) {
        const user = this.userRepo.create({ email, password, role, createdBy: userId, updatedBy: userId });
       
        this.logger.log(`role ${role}`);
        
        return this.userRepo.save(user);
    }

    async updateUser(id: number, role: UserRole, userId: number) {
        return this.userRepo.update(id, { role, updatedBy: userId });
    }

    async deleteUser(id: number) {
        return this.userRepo.delete(id);
    }
}
