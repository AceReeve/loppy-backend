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
  console.log('Starting bootstrap function');
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  console.log('Nest application created');
  const configService: ConfigService = app.get(ConfigService);
  console.log('ConfigService initialized');
  app.useGlobalPipes(new ValidationPipe());
  console.log('ValidationPipe applied');
  app.useGlobalFilters(new AllExceptionsFilter());
  console.log('AllExceptionsFilter applied');
  app.setGlobalPrefix('api');
  console.log('Global prefix set to "api"');
  const ALLOWED_ORIGINS = configService.get<string>('ALLOWED_ORIGINS');
  const PORT = configService.get<string>('PORT') || 3000;
  const isProd = process.env.NODE_ENV === 'prod';
  const isDev = process.env.NODE_ENV === 'dev';
  console.log(`Environment - isProd: ${isProd}, isDev: ${isDev}`);

  app.use(ruid({ setInContext: true }));
  console.log('ruid middleware applied');
  app.use(rawBodyMiddleware());
  console.log('rawBodyMiddleware applied');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  console.log('Body parsers applied');

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
  console.log('CORS configuration applied');

  const document = SwaggerModule.createDocument(app, swaggerConfig());
  console.log('Swagger document created');
  SwaggerModule.setup('docs', app, document);
  console.log('Swagger documentation setup complete');
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
    console.log('Running in dev mode');
    const httpsOptions = {
      key: fs.readFileSync('/etc/nginx/ssl/sandbox.servihero.com.key'),
      cert: fs.readFileSync('/etc/nginx/ssl/fullchain.pem'),
      ca: fs.readFileSync('/etc/nginx/ssl/fullchain.pem'),
      rejectUnauthorized: true,
    };
    console.log('HTTPS options loaded for dev mode');
    https.createServer(httpsOptions, app.getHttpAdapter().getInstance())
      .listen(PORT, () => console.log(`HTTPS server listening on port dev${PORT}`))
      .on('error', (error) => console.error('Failed to start HTTPS server:', error));

  }
  else {
    // Local setup without HTTPS
    await app.listen(PORT);
    console.log(`Server listening on port ${PORT}`);
  }
}
bootstrap();
