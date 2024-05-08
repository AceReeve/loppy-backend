import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, UpdateQuery, Types } from 'mongoose';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import * as bcrypt from 'bcrypt';
import { UserLoginDTO } from '../../dto/user';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleLoginUserDto } from '../../dto/auth/google-login.dto';
import { OauthRepository } from '../oauth/oauth.repository';
import { SignInBy } from '../../const';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    protected readonly oauthRepository: OauthRepository,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async validateUser(email: string, password: string): Promise<User | null> {
    let user: User | any;
    user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('Incorrect email');
    }
    if (user.login_by === SignInBy.SIGN_IN_BY_GOOGLE) {
      throw new BadRequestException(
        'Oops! It looks like you already have an account registered with Google Sign-In. Please log in using the Google button to continue',
      );
    } else if (user.login_by === SignInBy.SIGN_IN_BY_FACEBOOK) {
      throw new BadRequestException(
        'Oops! It looks like you already have an account registered with Facebook Sign-In. Please log in using the Facebook button to continue',
      );
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Incorrect Password');
    }
    return user;
  }
  generateJWT(payload: object, exp: string): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
    });
  }
  async login(userLoginDTO: UserLoginDTO) {
    let user: User | any;
    user = await this.validateUser(userLoginDTO.email, userLoginDTO.password);
    const { _id, first_name, last_name, email, status } = user;
    const payload = { email: user.email, sub: user._id };
    const access_token = this.generateJWT(
      payload,
      this.configService.get<string>('JWT_EXPIRATION'),
    );
    await this.userModel.findOneAndUpdate(
      { email: email },
      { $inc: { login_count: 1 } },
    );
    return { _id, first_name, last_name, email, status, access_token };
  }

  async googleLogin(user: GoogleLoginUserDto) {
    if (!user) {
      throw new UnauthorizedException('No user from google');
    }
    const { expires_in, accessToken, id_token } = user;

    const userData = await this.oauthRepository.recordLogin(
      user,
      SignInBy.SIGN_IN_BY_GOOGLE,
    );
    const access_token = await this.signJwt(
      userData.id,
      id_token,
      accessToken,
      expires_in,
    );
    return { access_token };
  }

  signJwt(
    userId: string,
    id_token: string,
    access_token: string,
    expires_at: number,
    expiresIn = '1d',
  ): Promise<any> {
    const payload = {
      sub: userId,
      id_token,
      access_token,
      expires_at,
    };
    return this.jwtService.signAsync(payload, {
      expiresIn,
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}
