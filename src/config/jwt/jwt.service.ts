import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class JSONWebTokenService {
  constructor(private readonly configService: ConfigService) { }

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '3600s' },
    };
  }
}
