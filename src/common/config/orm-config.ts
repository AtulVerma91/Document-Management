import { DataSourceOptions } from 'typeorm';
import { ConfigService } from './config.service';

export const ORM_CONFIGS = (configService: ConfigService): DataSourceOptions => ({
    type: 'postgres',
    host: configService.postgresConfig.host,
    port: configService.postgresConfig.port,
    username: configService.postgresConfig.username,
    password: configService.postgresConfig.password,
    database: configService.postgresConfig.database,
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
        __dirname + '/../entity/*.entity{.ts,.js}',
    ],
    logging: true,
    synchronize: false,
    migrations: ['dist/migrations/*.js'],
    extra: {
        application_name: 'oms_connection',
        statement_timeout: 50000,
        query_timeout: 50000,
        max: 5,
    },
});
