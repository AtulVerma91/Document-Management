import { DataSourceOptions } from 'typeorm';
import { config, ConfigService } from './config.service';

export const ORM_CONFIGS = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: config().postgres.host || 'localhost',
  port: config().postgres.port || 5432,
  username: config().postgres.username || 'admin',
  password: config().postgres.password || 'adminpassword',
  database: config().postgres.database || 'app_db',
  entities: [
    __dirname + '/../**/*.entity{.ts,.js}',
    __dirname + '/../entity/*.entity{.ts,.js}',
  ],
  logging: false,
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
  extra: {
    application_name: 'oms_connection',
    statement_timeout: 50000,
    query_timeout: 50000,
    max: 5,
  },
});
