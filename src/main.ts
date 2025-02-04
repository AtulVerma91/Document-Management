import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config, ConfigService } from './common/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get('server_port');
  await app.listen(port);
}
bootstrap();
