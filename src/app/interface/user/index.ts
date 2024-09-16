import { Schema as MongooseSchema, FilterQuery, Document } from 'mongoose';
import { GenericAbstractRepository } from 'src/app/interface/generic.abstract.repository';
import { User } from 'src/app/models/user/user.schema';
import {
  UserRegisterDTO,
  UserInfoDTO,
  InviteUserDTO,
  InvitedUserRegistrationDTO,
  ResetPasswordDto,
  ChangePasswordDto,
} from 'src/app/dto/user';
import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';

export abstract class AbstractUserRepository {
  abstract createUser(userRegisterDto: UserRegisterDTO): Promise<any>;
  abstract userData(id: string): Promise<any>;
  abstract createUserInfo(userInfoDTO: UserInfoDTO): Promise<any>;
  abstract profile(user: Partial<User> & { sub: string }): Promise<any>;
  abstract getUser(id: string): Promise<any>;
  abstract getUserByEmail(email: string): Promise<any>;
  abstract inviteUser(inviteUserDTO: InviteUserDTO): Promise<any>;
  abstract cancelInviteUser(email: string): Promise<any>;
  abstract validateInviteUser(inviteUserDTO: InviteUserDTO): Promise<any>;
  abstract updateUserStripeId(stripeId: string, userId: string): Promise<any>;
  abstract updateWeatherInfoId(
    weatherforecast_id: string,
    userId: string,
  ): Promise<any>;
  abstract invitedUserRegistration(
    invitedUserRegistrationDTO: InvitedUserRegistrationDTO,
    token: string,
  ): Promise<any>;
  abstract verifyOTP(email: string, otp: string): Promise<any>;
  abstract sendOTP(email: string): Promise<any>;
  abstract getInvitedUser(): Promise<any>;
  abstract uploadProfile(
    files: ProfileImages,
    userInfoId: string,
  ): Promise<any>;
  abstract getProfile(
    id: string,
    path: string,
    res: Response,
    type: string,
  ): Promise<void | StreamableFile>;
  abstract forgotPassword(email: string): Promise<any>;
  abstract resetPassword(
    token: string,
    resetPasswordDTO: ResetPasswordDto,
  ): Promise<any>;
  abstract getMember(): Promise<any>;
  abstract changePassword(changePasswordDTO: ChangePasswordDto): Promise<any>;
  abstract getAcceptedInvitedUser(): Promise<any>;
}

export abstract class AbstractUserService {
  abstract createUser(userRegisterDto: UserRegisterDTO): Promise<any>;
  abstract profile(): Promise<any>;
  abstract getUser(id: string): Promise<any>;
  abstract getUserByEmail(email: string): Promise<any>;
  abstract createUserInfo(userInfoDTO: UserInfoDTO): Promise<any>;
  abstract updateUserStripeId(stripeId: string, userId: string): Promise<any>;
  abstract updateWeatherInfoId(
    weatherforecast_id: string,
    userId: string,
  ): Promise<any>;
  abstract inviteUser(inviteUserDTO: InviteUserDTO): Promise<any>;
  abstract cancelInviteUser(email: string): Promise<any>;
  abstract getInvitedUser(): Promise<any>;
  abstract getAcceptedInvitedUser(): Promise<any>;
  abstract validateInviteUser(inviteUserDTO: InviteUserDTO): Promise<any>;
  abstract invitedUserRegistration(
    invitedUserRegistrationDTO: InvitedUserRegistrationDTO,
    token: string,
  ): Promise<any>;
  abstract verifyOTP(email: string, otp: string): Promise<any>;
  abstract sendOTP(email: string): Promise<any>;
  abstract uploadProfile(
    files: ProfileImages,
    userInfoId: string,
  ): Promise<any>;

  abstract getProfile(
    id: string,
    path: string,
    res: Response,
    type: string,
  ): Promise<void | StreamableFile>;
  abstract getMember(): Promise<any>;
  abstract forgotPassword(email: string): Promise<any>;
  abstract resetPassword(
    token: string,
    resetPasswordDTO: ResetPasswordDto,
  ): Promise<any>;
  abstract changePassword(changePasswordDTO: ChangePasswordDto): Promise<any>;
}
export interface RegisterResponseData {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
}

export interface LoginResponseData {
  _id: string;
  first_name: string;
  last_name: string;
  access_token: string;
  email?: string;
  status?: string;
}

interface File {
  path: string;
  filename: string;
  mimetype: string;
  created_at: string;
  file_id: any;
  extension: string;
}

export type ProfileImages = {
  image_1: File[];
  image_2: File[];
  image_3: File[];
  image_4: File[];
  image_5: File[];
};
