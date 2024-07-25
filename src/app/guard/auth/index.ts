import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/app/services/user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from 'src/app/models/role/role.schema';
import { Model } from 'mongoose';
import { UserRole } from 'src/app/const';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      request.user = decodedToken;
      request.token = token;
      return true;
    } catch (error) {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Token verification failed');
      }
    }
  }
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }
    const decodedToken = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    request.user = decodedToken;
    request.token = token;

    const roleDetails = await this.roleModel.findById(request.user.role);
    if (!roleDetails) {
      throw new UnauthorizedException('Role not found');
    }
    if (roleDetails.role_name !== UserRole.ADMIN) {
      throw new UnauthorizedException('User must be an Admin');
    }
    return true;
  }
}
@Injectable()
export class VerifyProfile implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    // Implement your logic to check if the user has a user profile
    // If user profile exists, return true; otherwise, return false
    return true; // Example implementation
  }
}
