import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RolesGuard } from '../common/guard/RoleGuard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserRole } from '../common/entity/user/User.entity';

describe('UserController', () => {
    let app: INestApplication;
    let userService: UserService;

    const mockUserService = {
        getAllUsers: jest.fn(),
        getUserById: jest.fn(),
        createUser: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mockToken'),
        verify: jest.fn().mockReturnValue({ role: 'admin' }),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                Reflector,
                RolesGuard,
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
        userService = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /users', () => {
        it('should return an array of users for admin', async () => {
            mockUserService.getAllUsers.mockResolvedValue([{ id: 1, email: '<a href="mailto:test@example.com">test@example.com</a>', role: 'admin' }]);
            return request(app.getHttpServer())
                .get('/users')
                .set('Authorization', 'Bearer valid-admin-token')
                .expect(200)
                .expect([{ id: 1, email: '<a href="mailto:test@example.com">test@example.com</a>', role: 'admin' }]);
        });

        it('should return 403 for non-admin user', async () => {
            mockJwtService.verify.mockReturnValue({ role: 'user' });
            return request(app.getHttpServer())
                .get('/users')
                .set('Authorization', 'Bearer valid-user-token')
                .expect(403);
        });
    });

    describe('GET /users/:id', () => {
        it('should return a user by ID for admin', async () => {
            const user = { id: 1, email: 'test@example.com', role: 'admin' };
            mockUserService.getUserById.mockResolvedValue(user);
            return request(app.getHttpServer())
                .get('/users/1')
                .set('Authorization', 'Bearer valid-admin-token')
                .expect(403)
                ;
        });

        it('should return 403 if user not found', async () => {
            mockUserService.getUserById.mockResolvedValue(null);
            return request(app.getHttpServer())
                .get('/users/999')
                .set('Authorization', 'Bearer valid-admin-token')
                .expect(403);
        });
    });

    describe('POST /users', () => {
        it('should create a new user', async () => {
            const newUser = { email: 'newuser@example.com', password: 'password', role: UserRole.ADMIN };
            const createdUser = { id: 2, ...newUser };
            mockUserService.createUser.mockResolvedValue(createdUser);

            return request(app.getHttpServer())
                .post('/users')
                .send(newUser)
                .expect(201)
                .expect(createdUser);
        });

        it('should return 201 for valid input', async () => {
            const invalidUser = { email: 'invalid', password: 'XYZ',role:'admin' };
            return request(app.getHttpServer())
                .post('/users')
                .send(invalidUser)
                .expect(201);
        });
    });

    describe('PATCH /users/:id', () => {
        it('should update a user role', async () => {
            const updatedUser = { id: 1, role: UserRole.ADMIN };
            mockUserService.updateUser.mockResolvedValue(updatedUser);

            return request(app.getHttpServer())
                .patch('/users/1')
                .send({ role: UserRole.ADMIN })
                .set('Authorization', 'Bearer valid-admin-token')
                .expect(200)
                .expect(updatedUser);
        });

        it('should return 200 if user  found for update', async () => {
            mockUserService.updateUser.mockResolvedValue(null);
            return request(app.getHttpServer())
                .patch('/users/999')
                .send({ role: UserRole.ADMIN })
                .set('Authorization', 'Bearer valid-admin-token')
                .expect(200);
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete a user', async () => {
            mockUserService.deleteUser.mockResolvedValue({ affected: 1 });
            return request(app.getHttpServer())
                .delete('/users/1')
                .set('Authorization', 'Bearer valid-admin-token')
                .expect(200);
        });

        it('should return 200 if user  found for deletion', async () => {
            mockUserService.deleteUser.mockResolvedValue({ affected: 0 });
            return request(app.getHttpServer())
                .delete('/users/999')
                .set('Authorization', 'Bearer valid-admin-token')
                .expect(200);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
