import { Injectable } from '@nestjs/common';

export const config = () => ({
  logger: {
    logLevel: process.env.OMS_LOG_LEVEL,
  },
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env[`POSTGRES_USER`],
    password: process.env[`POSTGRES_PASSWORD`],
    database: process.env.POSTGRES_DB,
  },
  jwtSecret: process.env[`JWT_SECRET`] || 'secret',
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
