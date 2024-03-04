import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as _ from 'lodash';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './global/AllExceptionsFilter';
import { ValidationPipe } from './global/ValidationPipe';
import swaggerConfig from './swagger';
const ruid = require('express-ruid');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api');
  const ALLOWED_ORIGINS = configService.get<string>('ALLOWED_ORIGINS');
  const PORT = configService.get<string>('PORT') || 3000;

  app.use(ruid({ setInContext: true }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors(
    process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'local'
      ? { origin: true }
      : {
        origin: AppModule.allowedOrigins
          ? AppModule.allowedOrigins
          : _.map(ALLOWED_ORIGINS?.split(','), (origin) => origin),
        credentials: true,
      },
  );

  const document = SwaggerModule.createDocument(app, swaggerConfig());
  SwaggerModule.setup('docs', app, document);
  await app.listen(PORT);
}
bootstrap();
