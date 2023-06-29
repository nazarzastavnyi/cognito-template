import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot({});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from '@common/exceptions';
import { RequestInterceptor } from '@common/interceptors/request.interceptor';
import swagger from '@src/swagger/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  swagger(app);
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new RequestInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.json({ limit: '3mb' }));

  await app.listen(process.env.APP_PORT || '3000');
}
bootstrap();
