import { Injectable } from '@nestjs/common';
import { ConfigService as NestJSConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
    constructor(private readonly configService: NestJSConfigService) { }

    get loggerLogLevel(): string {
        return this.configService.get<string>('LOG_LEVEL') || 'info';  // Default to 'info'
    }

    get postgresConfig() {
        return {
            host: this.configService.get<string>('POSTGRES_HOST') || 'localhost',
            port: this.configService.get<number>('POSTGRES_PORT') || 5432,
            username: this.configService.get<string>('POSTGRES_USER') || 'root',
            password: this.configService.get<string>('POSTGRES_PASSWORD') || 'root',
            database: this.configService.get<string>('POSTGRES_DB') || 'app_db',
        };
    }

    get jwtSecret(): string {
        return this.configService.get<string>('JWT_SECRET') || 'secret';
    }
}
