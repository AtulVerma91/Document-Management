import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../entity/User.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) { }

    async getAllUsers() {
        return this.userRepo.find();
    }

    async getUserById(id: number) {
        return this.userRepo.findOne({ where: { id } });
    }

    async createUser(email: string, password: string, role: UserRole, userId: number) {
        const user = this.userRepo.create({ email, password, role, createdBy: userId, updatedBy: userId });
        return this.userRepo.save(user);
    }

    async updateUser(id: number, role: UserRole, userId: number) {
        return this.userRepo.update(id, { role, updatedBy: userId });
    }

    async deleteUser(id: number) {
        return this.userRepo.delete(id);
    }
}
