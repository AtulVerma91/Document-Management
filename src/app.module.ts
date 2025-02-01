import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './common/config/config.module';
import { ConfigService } from './common/config/config.service';
import { ORM_CONFIGS } from './common/config/orm-config';
import { UserModule } from './common/user/user.module';
import { LoggerModule } from './common/logger/logger.module';


@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ORM_CONFIGS(configService),
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class AppModule { }
