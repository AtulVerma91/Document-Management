import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User, UserRole } from '../common/entity/user/User.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
    let service: UserService;
    let repository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should get all users', async () => {
        jest.spyOn(repository, 'find').mockResolvedValue([]);
        expect(await service.getAllUsers()).toEqual([]);
    });

    it('should get a user by ID', async () => {
        const user = { id: 1, email: '<a href="mailto:test@example.com">test@example.com</a>' };
        jest.spyOn(repository, 'findOne').mockResolvedValue(user as User);
        expect(await service.getUserById(1)).toEqual(user);
    });

    it('should create a user', async () => {
        const user = { email: '<a href="mailto:test@example.com">test@example.com</a>', password: 'pass', role: UserRole.ADMIN, createdBy: 1, updatedBy: 1 };
        jest.spyOn(repository, 'create').mockReturnValue(user as User);
        jest.spyOn(repository, 'save').mockResolvedValue(user as User);
        expect(await service.createUser(user.email, user.password, user.role, 1)).toEqual(user);
    });

    it('should update a user role', async () => {
        jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as any);
        expect(await service.updateUser(1, UserRole.ADMIN, 1)).toEqual({ affected: 1 });
    });

    it('should delete a user', async () => {
        jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);
        expect(await service.deleteUser(1)).toEqual({ affected: 1 });
    });
});
