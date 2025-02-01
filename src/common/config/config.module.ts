import { Module } from '@nestjs/common';
import { ConfigService as NestJSConfigService } from '@nestjs/config';
import { ConfigService } from './config.service';

@Module({
    imports: [],
    providers: [ConfigService, NestJSConfigService],
    exports: [ConfigService],
})
export class ConfigModule { }
