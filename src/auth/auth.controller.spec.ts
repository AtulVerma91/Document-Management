import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../common/dto/user/create-user.dto';
import { LoginDto } from '../common/dto/login/login.dto';
import { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('login', () => {
        it('should log in a user and set a cookie', async () => {
            const loginDto: LoginDto = { email: '<a href="mailto:test@example.com">test@example.com</a>', password: 'password123' };
            const mockResponse = { cookie: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
            const mockToken = { access_token: 'mock-access-token' };

            mockAuthService.login.mockResolvedValue(mockToken);

            await authController.login(loginDto, mockResponse);

            expect(authService.login).toHaveBeenCalledWith(loginDto);
            expect(mockResponse.cookie).toHaveBeenCalledWith('access_token', 'mock-access-token', expect.any(Object));
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Login successful' });
        });

        it('should throw UnauthorizedException if login fails', async () => {
            const loginDto: LoginDto = { email: '<a href="mailto:wrong@example.com">wrong@example.com</a>', password: 'wrongpassword' };
            const mockResponse = { cookie: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;

            mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

            await expect(authController.login(loginDto, mockResponse)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const createUserDto: CreateUserDto = {
                email: 'newuser@example.com',
                password: 'password123',
                role: 'admin',
                createdBy: 1, 
                updatedBy: 1, 
                createdAt: new Date(), 
                updatedAt: new Date(), 
            };
            const mockResult = { code: 200, message: 'user created successfully' };

            mockAuthService.register.mockResolvedValue(mockResult);

            const result = await authController.register(createUserDto);

            expect(authService.register).toHaveBeenCalledWith(createUserDto);
            expect(result).toEqual(mockResult);
        });
    });

    describe('logout', () => {
        it('should log out a user and blacklist the token', async () => {
            const mockResponse = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
            const mockToken = 'mock-access-token';
            const mockAuthHeader = `Bearer ${mockToken}`;

            mockAuthService.logout.mockResolvedValue({ message: 'Logged out successfully' });

            await authController.logout(mockAuthHeader, mockResponse);

            expect(authService.logout).toHaveBeenCalledWith(mockToken);
           
        });

        it('should throw an error if token is not provided', async () => {
            const mockResponse = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;

            await expect(authController.logout('', mockResponse)).rejects.toThrow('Token not provided');
        });
    });
});
