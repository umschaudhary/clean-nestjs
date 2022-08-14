import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {AppModule} from "./app/app.module" 
import { setUpSwagger } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  setUpSwagger(app)
  await app.listen(3000);
}
bootstrap();
