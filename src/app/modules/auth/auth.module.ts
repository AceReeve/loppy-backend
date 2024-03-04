import { Module } from '@nestjs/common';
import { AuthController } from 'src/app/controller/auth/auth.controller';
import { UserSchemaModule } from 'src/app/models/user/user.schema.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JSONWebTokenModule } from 'src/config/jwt/jwt.module';
import { JwtService } from '@nestjs/jwt';

import { AuthRepository } from 'src/app/repository/auth/auth.repository';
import { UserRepository } from 'src/app/repository/user/user.repository';

@Module({
    imports: [
        ConfigModule,
        UserSchemaModule,
        UserModule,
        JSONWebTokenModule,
    ],

    controllers: [AuthController],
    providers: [AuthService, AuthRepository, UserRepository, JwtService],
})
export class AuthModule { }
