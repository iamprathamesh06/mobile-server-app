import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true, origin: true },
  });
  app.use(cookieParser());
  // app.useLogger(app.get(Logger));
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  });
  await app.listen(3001);
}
bootstrap();
