import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, UpdateQuery, Types } from 'mongoose';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import {
  UserInfo,
  UserInfoDocument,
} from 'src/app/models/user/user-info.schema';
import * as bcrypt from 'bcrypt';
import { GoogleSaveDTO, UserLoginDTO } from '../../dto/user';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleLoginUserDto } from '../../dto/auth/google-login.dto';
import { OauthRepository } from '../oauth/oauth.repository';
import { DefaultUserRole, SignInBy, UserRole } from '../../const';
import * as jwt from 'jsonwebtoken';
import { Role, RoleDocument } from 'src/app/models/role/role.schema';
@Injectable()
export class AuthRepository {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    protected readonly oauthRepository: OauthRepository,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,
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
    const { _id, first_name, last_name, email, status, role } = user;
    const payload = { email: user.email, sub: user._id, role };
    const access_token = this.generateJWT(
      payload,
      this.configService.get<string>('JWT_EXPIRATION'),
    );
    await this.userModel.findOneAndUpdate(
      { email: email },
      { $inc: { login_count: 1 } },
    );
    return { _id, first_name, last_name, email, status, access_token, role };
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
    const userRole = await this.userModel.findOne({ email: user.email });
    const access_token = await this.signJwt(
      userData.id,
      id_token,
      accessToken,
      expires_in,
      userRole.role,
      user.email,
    );
    return { access_token, role: userRole.role };
  }

  async googleSave(googleSaveDTO: GoogleSaveDTO) {
    const data = await this.userModel.findOne({ email: googleSaveDTO.email });
    const verifyToken = await this.verifyToken(
      googleSaveDTO.email,
      googleSaveDTO.first_name,
      googleSaveDTO.last_name,
      googleSaveDTO.token,
    );
    const role = await this.roleModel.findOne({
      role_name: DefaultUserRole.OWNER,
    });

    if (data) {
      // if (data.login_by !== SignInBy.SIGN_IN_BY_GOOGLE) {
      //   throw new Error(
      //     `this email : '${googleSaveDTO.email}' is already registered, Please use another email!`,
      //   );
      // }
      const userData = await this.userModel.findOneAndUpdate(
        { email: data.email },
        { $inc: { login_count: 1 } },
      );
      const payload = { email: userData.email, sub: userData._id, role };
      const access_token = this.generateJWT(
        payload,
        this.configService.get<string>('JWT_EXPIRATION'),
      );
      return { userData, access_token, role };
    } else {
      const userData = await this.userModel.create({
        email: googleSaveDTO.email,
        login_by: SignInBy.SIGN_IN_BY_GOOGLE,
        role: role,
        login_count: 1,
      });

      const userInfo = await this.userInfoModel.create({
        user_id: userData._id,
        first_name: googleSaveDTO.first_name,
        last_name: googleSaveDTO.last_name,
        picture: googleSaveDTO.picture,
      });

      const payload = { email: userData.email, sub: userData._id, role };
      const access_token = this.generateJWT(
        payload,
        this.configService.get<string>('JWT_EXPIRATION'),
      );
      return { userData, userInfo, access_token, role };
    }
  }

  async verifyToken(
    email: string,
    first_name: string,
    last_name: string,
    token: string,
  ) {
    try {
      const secret = this.configService.get('JWT_SECRET');
      const decoded = jwt.verify(token, secret) as { email: string };
      const userDetails = await this.userModel.findOne({
        email: decoded?.email,
      });
      if (userDetails) {
        // Validate email
        if (userDetails.email !== email) {
          throw new UnauthorizedException('Invalid email');
        }
        // const userInfoDetails = await this.userInfoModel.findOne({
        //   user_id: userDetails._id,
        // });
        // if (userInfoDetails) {
        //   // Validate first name
        //   if (userInfoDetails.first_name !== first_name) {
        //     throw new UnauthorizedException('Invalid first name');
        //   }
        //   // Validate last name
        //   if (userInfoDetails.last_name !== last_name) {
        //     throw new UnauthorizedException('Invalid last name');
        //   }
        // }
      }

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  signJwt(
    userId: string,
    id_token: string,
    access_token: string,
    expires_at: number,
    role: any,
    email: string,
    expiresIn = '1d',
  ): Promise<any> {
    const payload = {
      sub: userId,
      id_token,
      access_token,
      expires_at,
      role,
      email,
    };
    return this.jwtService.signAsync(payload, {
      expiresIn,
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}
