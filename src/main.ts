import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as _ from 'lodash';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as https from 'https';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './global/AllExceptionsFilter';
import { ValidationPipe } from './global/ValidationPipe';
import swaggerConfig from './swagger';
import rawBodyMiddleware from './app/middlewares/rawBodyMiddleware';
const ruid = require('express-ruid');

async function bootstrap(): Promise<void> {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  const configService: ConfigService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api');
  const ALLOWED_ORIGINS = configService.get<string>('ALLOWED_ORIGINS');
  const PORT = configService.get<string>('PORT') || 3000;
  const HTTPS_PATH_SSL_KEY = configService.get<string>('HTTPS_PATH_SSL_KEY');
  const HTTPS_PATH_SSL_CERT = configService.get<string>('HTTPS_PATH_SSL_CERT');
  const isProd = process.env.NODE_ENV === 'prod';
  const isDev = process.env.NODE_ENV === 'dev';

  app.use(ruid({ setInContext: true }));
  app.use(rawBodyMiddleware());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors(
    process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'dev' 
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

  if (isProd) {
    // Production setup with HTTPS
    const httpsOptions = {
      key: fs.readFileSync('/etc/nginx/ssl/servihero.com.key'),
      cert: fs.readFileSync('/etc/nginx/ssl/servihero.com.crt'),
    };

    https
      .createServer(httpsOptions, app.getHttpAdapter().getInstance())
      .listen(PORT, () => {
        console.log(`HTTPS server listening on port ${PORT}`);
      });
  } 
  else if(isDev){
    const httpsOptions = {
      key: fs.readFileSync('/etc/nginx/ssl/sandbox.servihero.com.key'),
      cert: fs.readFileSync('/etc/nginx/ssl/sandbox.servihero.com.crt'),
      ca: fs.readFileSync('/etc/nginx/ssl/sandbox.servihero-cabundle.com.pem'),
    };

    https
      .createServer(httpsOptions, app.getHttpAdapter().getInstance())
      .listen(PORT, () => {
        console.log(`HTTPS server listening on port ${PORT}`);
      });
  }
  else {
    // Local setup without HTTPS
    await app.listen(PORT);
    console.log(`Server listening on port ${PORT}`);
  }
}
bootstrap();
