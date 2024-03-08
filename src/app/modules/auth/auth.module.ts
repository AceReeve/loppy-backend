import { Module } from '@nestjs/common';
import { AuthController } from 'src/app/controller/auth/auth.controller';
import { UserSchemaModule } from 'src/app/models/user/user.schema.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JSONWebTokenModule } from 'src/config/jwt/jwt.module';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from 'src/app/strategy/oauth/google/google.strategy';
import { FacebookStrategy } from 'src/app/strategy/oauth/facebook/facebook.strategy';
import { RoleSchemaModule } from 'src/app/models/role/role.schema.module';

import { AuthRepository } from 'src/app/repository/auth/auth.repository';
import { UserRepository } from 'src/app/repository/user/user.repository';
import { OauthRepository } from 'src/app/repository/oauth/oauth.repository';
import { OauthSchemaModule } from 'src/app/models/oauth/aouth.schema.module';

@Module({
  imports: [
    ConfigModule,
    UserSchemaModule,
    UserModule,
    JSONWebTokenModule,
    PassportModule.register({ defaultStrategy: 'google' }),
    PassportModule.register({ defaultStrategy: 'facebook' }),
    RoleSchemaModule,
    OauthSchemaModule
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    UserRepository,
    JwtService,
    GoogleStrategy,
    FacebookStrategy,
    OauthRepository
  ],
})
export class AuthModule { }
