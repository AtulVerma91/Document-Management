import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
export const config = () => ({
  logger: {
    logLevel: process.env.OMS_LOG_LEVEL,
  },
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: +process.env.POSTGRES_PORT || 5432,
    username: process.env[`POSTGRES_USER`] || 'admin',
    password: process.env[`POSTGRES_PASSWORD`] || 'adminpassword',
    database: process.env[`POSTGRES_DB`] || 'app_db',
    entities: [
      __dirname + '/../**/*.entity{.ts,.js}',
      __dirname + '/../entity/*.entity{.ts,.js}',
    ],
    logging: false,
    synchronize: false,
    migrations: ['dist/migrations/*.js'],
  },
  jwtSecret: process.env[`JWT_SECRET`] || 'secret',
  server_port: process.env.SERVER_PORT || 3000,
});
@Injectable()
export class ConfigService {
  private readonly config: { [key: string]: any };
  constructor() {
    this.config = config();
  }

  get(key: string, config = this.config): any {
    const keys: string[] = key.split('.');
    if (keys.length === 1) {
      console.log(config[key]);
      return config[key];
    }
    const configs = config[keys[0]];
    return this.get(keys.slice(1).join('.'), configs);
  }

  set(key: string, value: any, config = this.config): any {
    const keys: string[] = key.split('.');
    if (keys.length === 1) {
      return (config[key] = value);
    }
    const configs = config[keys[0]];
    return this.set(keys.slice(1).join('.'), value, configs);
  }
}
