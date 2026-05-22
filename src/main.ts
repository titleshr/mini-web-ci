import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { testDatabaseConnection } from './database/database.client';

async function bootstrap() {
  await testDatabaseConnection();

  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT || 3000);

  await app.listen(port, '0.0.0.0');
}

bootstrap();