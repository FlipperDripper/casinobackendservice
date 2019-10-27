import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {ValidateException} from "./exceptions/ValidateException";
import {LocalAuthGuard} from './auth/localAuth.guard';
import {ResponseInterceptor} from "./interseptors/Response";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // pipe for validation requests
  app.useGlobalPipes(new ValidationPipe());
  // filter for formatting error responses
  app.useGlobalFilters(new ValidateException());
  // interceptor for mapping responses
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(3000);
}
bootstrap();
