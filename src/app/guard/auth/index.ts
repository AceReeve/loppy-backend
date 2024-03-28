import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/app/services/user/user.service';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET')
      });
      request.user = decodedToken;
      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Token verification failed');
      }
    }
  }
}

@Injectable()
export class VerifyProfile implements CanActivate {
  constructor() { }

  canActivate(context: ExecutionContext): boolean {
    // Implement your logic to check if the user has a user profile
    // If user profile exists, return true; otherwise, return false
    return true; // Example implementation
  }
}
