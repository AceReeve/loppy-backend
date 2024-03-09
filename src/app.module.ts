import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'src/global/LoggingInterceptor';
import { LoggingMiddleware } from 'src/app/middlewares/logging.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationModule } from './config/config.module';
import { UserModule } from './app/modules/user/user.module';
import { DatabaseModule } from './config/database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './app/modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { StripeModule } from 'src/app/modules/api/api.module';
import { RoleModule } from './app/modules/role/role.module';
import { TwilioModule } from './app/modules/api/twilio/twilio.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    ConfigurationModule,
    MongooseModule,
    DatabaseModule,
    AuthModule,
    JwtModule,
    StripeModule,
    RoleModule,
    TwilioModule,
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  static allowedOrigins: string[] | null;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
