import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ORM_CONFIGS } from './orm-config';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...ORM_CONFIGS(configService),
        autoLoadEntities: true,
        migrationsRun: true,
      }),
      dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options);
        return dataSource.initialize();
      },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
