import { Module } from '@nestjs/common';
import { AuthController } from 'src/app/controller/auth/auth.controller';
import { UserSchemaModule } from 'src/app/models/user/user.schema.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from 'src/app/strategy/oauth/google/google.strategy';
import { FacebookStrategy } from 'src/app/strategy/oauth/facebook/facebook.strategy';
import { RoleSchemaModule } from 'src/app/models/role/role.schema.module';
import { AuthRepository } from 'src/app/repository/auth/auth.repository';
import { UserRepository } from 'src/app/repository/user/user.repository';
import { OauthRepository } from 'src/app/repository/oauth/oauth.repository';
import { OauthSchemaModule } from 'src/app/models/oauth/aouth.schema.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../../guard/http-jwt-auth.guard';
import { JwtStrategy } from '../../strategy/oauth/jwt/jwt.strategy';

import { EmailerModule } from '@util/emailer/emailer';
import { StripeEventSchemaModule } from 'src/app/models/stripe/stripe.event.schema.module';
import { InvitedUserSchemaModule } from 'src/app/models/invited-users/invited-users.schema.module';
import { WeatherForecastSchemaModule } from 'src/app/models/weatherforecast/weatherforecast.schema.module';
import { OtpSchemaModule } from 'src/app/models/otp/otp.schema.module';
@Module({
  imports: [
    ConfigModule,
    UserSchemaModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'google' }),
    PassportModule.register({ defaultStrategy: 'facebook' }),
    RoleSchemaModule,
    OauthSchemaModule,
    EmailerModule,
    StripeEventSchemaModule,
    InvitedUserSchemaModule,
    WeatherForecastSchemaModule,
    OtpSchemaModule,
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    UserRepository,
    JwtService,
    GoogleStrategy,
    FacebookStrategy,
    JwtStrategy,
    OauthRepository,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
