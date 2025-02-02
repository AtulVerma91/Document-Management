import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserRole } from '../common/entity/user/User.entity';
import { BlacklistedToken } from '../common/entity/blacklisted-token.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as crypto from 'crypto';

describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: Repository<User>;
    let blacklistRepository: Repository<BlacklistedToken>;
    let jwtService: JwtService;

    const mockUserRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
    };

    const mockBlacklistRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
        decode: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: getRepositoryToken(BlacklistedToken),
                    useValue: mockBlacklistRepository,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        blacklistRepository = module.get<Repository<BlacklistedToken>>(getRepositoryToken(BlacklistedToken));
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const createUserDto = {
                email: 'newuser@example.com',
                password: 'password123',
                role: 'admin',
                createdBy: 1,
                updatedBy: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const mockUser = { ...createUserDto, id: 1 };
            const mockToken = 'mock-access-token';

            mockUserRepository.findOne.mockResolvedValue(null);
            mockUserRepository.create.mockReturnValue(mockUser);
            mockUserRepository.save.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue(mockToken);

            const result = await authService.register(createUserDto);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { email: 'newuser@example.com' },
            });
            expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
            
            expect(result).toEqual({
                code: 200,
                message: 'user created successfully',
            });
        });


        it('should throw ConflictException if user already exists', async () => {
            const createUserDto = {
                email: 'existinguser@example.com',
                password: 'password123',
                role: 'admin',
                createdBy: 1,
                updatedBy: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const existingUser = { ...createUserDto, id: 1 };

            mockUserRepository.findOne.mockResolvedValue(existingUser);

            await expect(authService.register(createUserDto)).rejects.toThrow(
                ConflictException,
            );
            await expect(authService.register(createUserDto)).rejects.toThrow(
                'Username already taken',
            );
        });
    });

    describe('login', () => {
        it.skip('should successfully log in and return a token', async () => {
            const loginDto = { email: 'user@example.com', password: 'password123' };
            const mockUser = {
                email: 'user@example.com',
                password: '098f6bcd4621d373cade4e832627b4f6',
                role: 'admin',
            };
            const mockToken = 'mock-access-token';

            mockUserRepository.findOne.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue(mockToken);

            const result = await authService.login(loginDto);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { email: 'user@example.com' },
            });
            expect(mockJwtService.sign).toHaveBeenCalledWith({
                email: 'user@example.com',
                role: 'admin',
            });
           expect(result).toEqual({ access_token: mockToken });
        });

        it('should throw UnauthorizedException if user not found', async () => {
            const loginDto = { email: 'wronguser@example.com', password: 'password123' };
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(authService.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
            await expect(authService.login(loginDto)).rejects.toThrow(
                'Invalid credentials',
            );
        });

        it('should throw UnauthorizedException if password does not match', async () => {
            const loginDto = { email: 'user@example.com', password: 'wrongpassword' };
            const mockUser = {
                email: 'user@example.com',
                password: '098f6bcd4621d373cade4e832627b4f6', // md5('password123')
                role: 'admin',
            };

            mockUserRepository.findOne.mockResolvedValue(mockUser);

            await expect(authService.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
            await expect(authService.login(loginDto)).rejects.toThrow(
                'Invalid credentials',
            );
        });
    });

    describe('generateToken', () => {
        it('should generate a token for a user', async () => {
            const mockUser = {
                id: 1,
                email: 'user@example.com',
                password: '098f6bcd4621d373cade4e832627b4f6',
                role: UserRole.ADMIN,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 1,
                updatedBy: 1,
                hashPassword: jest.fn().mockReturnValue('hashed-password'),
                setCreatedBy: jest.fn(),
                setUpdatedBy: jest.fn(),
            };

            const mockToken = 'mock-access-token';

            mockJwtService.sign.mockReturnValue(mockToken);

            const result = await authService.generateToken(mockUser);

            expect(mockJwtService.sign).toHaveBeenCalledWith({
                email: 'user@example.com',
                role: UserRole.ADMIN,
            });
            expect(result).toEqual({ access_token: mockToken });
        });
    });

    describe('logout', () => {
        it('should successfully log out a user and blacklist the token', async () => {
            const token = 'mock-access-token';
            const decodedToken = { exp: 1625031023, email: 'user@example.com' };

            mockJwtService.decode.mockReturnValue(decodedToken);
            mockBlacklistRepository.create.mockReturnValue({
                token,
                expiry: new Date(decodedToken.exp * 1000),
            });
            mockBlacklistRepository.save.mockResolvedValue({
                token,
                expiry: new Date(decodedToken.exp * 1000),
            });

            const result = await authService.logout(token);

            expect(mockJwtService.decode).toHaveBeenCalledWith(token);
            expect(mockBlacklistRepository.create).toHaveBeenCalledWith({
                token,
                expiry: new Date(decodedToken.exp * 1000),
            });
            expect(mockBlacklistRepository.save).toHaveBeenCalledWith({
                token,
                expiry: new Date(decodedToken.exp * 1000),
            });
            expect(result).toEqual({ message: 'Logged out successfully' });
        });

        it('should throw UnauthorizedException if token is invalid', async () => {
            const invalidToken = 'invalid-token';
            mockJwtService.decode.mockReturnValue(null);

            await expect(authService.logout(invalidToken)).rejects.toThrow(
                UnauthorizedException,
            );
            await expect(authService.logout(invalidToken)).rejects.toThrow(
                'Invalid token',
            );
        });
    });

    describe('isTokenBlacklisted', () => {
        it('should return true if token is blacklisted', async () => {
            const token = 'mock-access-token';
            mockBlacklistRepository.findOne.mockResolvedValue({ token });

            const result = await authService.isTokenBlacklisted(token);

            expect(mockBlacklistRepository.findOne).toHaveBeenCalledWith({
                where: { token },
            });
            expect(result).toBe(true);
        });

        it('should return false if token is not blacklisted', async () => {
            const token = 'mock-access-token';
            mockBlacklistRepository.findOne.mockResolvedValue(null);

            const result = await authService.isTokenBlacklisted(token);

            expect(mockBlacklistRepository.findOne).toHaveBeenCalledWith({
                where: { token },
            });
            expect(result).toBe(false);
        });
    });
});
