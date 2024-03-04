import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JSONWebTokenService } from './jwt.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useClass: JSONWebTokenService,
    }),
  ],
})
export class JSONWebTokenModule { }
