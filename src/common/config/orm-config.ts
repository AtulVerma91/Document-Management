import { DataSourceOptions } from 'typeorm';
import { config, ConfigService } from './config.service';

export const ORM_CONFIGS = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: config().postgres.host,
  port: config().postgres.port,
  username: config().postgres.username,
  password: config().postgres.password,
  database: config().postgres.database,
  entities: [
    __dirname + '/../**/*.entity{.ts,.js}',
    __dirname + '/../entity/*.entity{.ts,.js}',
  ],
  logging: false,
  synchronize: false,
  migrations: ['./dist/migrations/*.js'],
  extra: {
    application_name: 'document_connection',
    statement_timeout: 50000,
    query_timeout: 50000,
    max: 5,
  },
});
