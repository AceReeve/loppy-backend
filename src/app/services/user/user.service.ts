import {
  Injectable,
  Inject,
  UnauthorizedException,
  StreamableFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as _ from 'lodash';
import {
  UserRegisterDTO,
  UserInfoDTO,
  InviteUserDTO,
  InvitedUserRegistrationDTO,
  ResetPasswordDto,
  ChangePasswordDto,
  CreatePasswordDto,
} from 'src/app/dto/user';
import { AbstractUserService, ProfileImages , UserInterface} from 'src/app/interface/user';
import { AbstractUserRepository } from 'src/app/interface/user';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import {
  UserInfo,
  UserInfoDocument,
} from 'src/app/models/user/user-info.schema';
import { Response } from 'express';
@Injectable()
export class UserService implements AbstractUserService {
  constructor(
    private readonly repository: AbstractUserRepository,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,
  ) {}

  async createUser(userRegisterDto: UserRegisterDTO): Promise<any> {
    return await this.repository.createUser(userRegisterDto);
  }
  async changePassword(req: UserInterface, changePasswordDto: ChangePasswordDto): Promise<any> {
    return await this.repository.changePassword(req, changePasswordDto);
  }
  async createPassword(req: UserInterface,createPasswordDto: CreatePasswordDto): Promise<any> {
    return await this.repository.createPassword(req, createPasswordDto);
  }
  async createUserInfo(req: UserInterface, userInfoDTO: UserInfoDTO): Promise<any> {
    return await this.repository.createUserInfo(req, userInfoDTO);
  }

  async profile(req: UserInterface): Promise<any> {
    const user = req.user;
    return await this.repository.profile(req);
  }
  async getUser(id: string): Promise<any> {
    return await this.repository.getUser(id);
  }

  async getUserByEmail(email: string): Promise<any> {
    return await this.repository.getUserByEmail(email);
  }
  async getInvitedUser(req: UserInterface): Promise<any> {
    return await this.repository.getInvitedUser(req);
  }
  async getAcceptedInvitedUser(req: UserInterface): Promise<any> {
    return await this.repository.getAcceptedInvitedUser(req);
  }
  async findByUserId(userId: string) {
    const userInfo = await this.userInfoModel.findOne({ user_id: userId });
    return userInfo;
  }
  async inviteUser(req: UserInterface, inviteUserDTO: InviteUserDTO): Promise<any> {
    return await this.repository.inviteUser(req, inviteUserDTO);
  }

  async cancelInviteUser(req: UserInterface, email: string): Promise<any> {
    return await this.repository.cancelInviteUser(req, email);
  }

  async validateInviteUser(req: UserInterface, inviteUserDTO: InviteUserDTO): Promise<any> {
    return await this.repository.validateInviteUser(req, inviteUserDTO);
  }

  async updateUserStripeId(stripeId: string, userId: string): Promise<any> {
    return await this.repository.updateUserStripeId(stripeId, userId);
  }

  async updateWeatherInfoId(
    weatherforecast_id: string,
    userId: string,
  ): Promise<any> {
    return this.repository.updateWeatherInfoId(weatherforecast_id, userId);
  }

  async invitedUserRegistration(
    invitedUserRegistrationDTO: InvitedUserRegistrationDTO,
    token: string,
  ): Promise<any> {
    return await this.repository.invitedUserRegistration(
      invitedUserRegistrationDTO,
      token,
    );
  }

  async sendOTP(email: string): Promise<any> {
    return this.repository.sendOTP(email);
  }
  async verifyOTP(email: string, otp: string): Promise<any> {
    return this.repository.verifyOTP(email, otp);
  }
  async uploadProfile(req: UserInterface, files: ProfileImages, userInfoId: string): Promise<any> {
    return this.repository.uploadProfile(req, files, userInfoId);
  }
  async userData(id: string): Promise<any> {
    return this.repository.userData(id);
  }
  async getProfile(
    id: string,
    path: string,
    res: Response,
    type: string,
  ): Promise<void | StreamableFile> {
    return this.repository.getProfile(id, path, res, type);
  }
  async forgotPassword(email: string): Promise<any> {
    return this.repository.forgotPassword(email);
  }
  async resetPassword(
    token: string,
    resetPasswordDTO: ResetPasswordDto,
  ): Promise<any> {
    return this.repository.resetPassword(token, resetPasswordDTO);
  }
  async getMember(req: UserInterface,): Promise<any> {
    return this.repository.getMember(req);
  }
  async getAllUsers(req: UserInterface): Promise<any> {
    return this.repository.getAllUsers(req);
  }
}
