import { Schema as MongooseSchema, FilterQuery, Document } from 'mongoose';
import { GenericAbstractRepository } from 'src/app/interface/generic.abstract.repository';
import {
  UserRegisterDTO,
  UserInfoDTO,
  InviteUserDTO,
  InvitedUserRegistrationDTO,
  ResetPasswordDto,
  ChangePasswordDto,
  CreatePasswordDto,
} from 'src/app/dto/user';
import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';

export abstract class AbstractUserRepository {
  abstract createUser(userRegisterDto: UserRegisterDTO): Promise<any>;
  abstract userData(id: string): Promise<any>;
  abstract createUserInfo(req: UserInterface,userInfoDTO: UserInfoDTO): Promise<any>;
  abstract profile(req: UserInterface): Promise<any>;
  abstract getUser(id: string): Promise<any>;
  abstract getUserByEmail(email: string): Promise<any>;
  abstract inviteUser(req: UserInterface,inviteUserDTO: InviteUserDTO): Promise<any>;
  abstract cancelInviteUser(req: UserInterface,email: string): Promise<any>;
  abstract validateInviteUser(req: UserInterface,inviteUserDTO: InviteUserDTO): Promise<any>;
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
  abstract getInvitedUser(req: UserInterface): Promise<any>;
  abstract uploadProfile(
    req: UserInterface,
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
  abstract getMember(req: UserInterface,): Promise<any>;
  abstract changePassword(req: UserInterface,changePasswordDTO: ChangePasswordDto): Promise<any>;
  abstract createPassword(req: UserInterface,createPasswordDto: CreatePasswordDto): Promise<any>;
  abstract getAcceptedInvitedUser(req: UserInterface): Promise<any>;
  abstract getAllUsers(req: UserInterface,): Promise<any>;
}

export abstract class AbstractUserService {
  abstract createUser(userRegisterDto: UserRegisterDTO): Promise<any>;
  abstract profile(req: UserInterface): Promise<any>;
  abstract getUser(id: string): Promise<any>;
  abstract getUserByEmail(email: string): Promise<any>;
  abstract createUserInfo(req: UserInterface,userInfoDTO: UserInfoDTO): Promise<any>;
  abstract updateUserStripeId(stripeId: string, userId: string): Promise<any>;
  abstract updateWeatherInfoId(
    weatherforecast_id: string,
    userId: string,
  ): Promise<any>;
  abstract inviteUser(req: UserInterface,inviteUserDTO: InviteUserDTO): Promise<any>;
  abstract cancelInviteUser(req: UserInterface,email: string): Promise<any>;
  abstract getInvitedUser(req: UserInterface,): Promise<any>;
  abstract getAcceptedInvitedUser(req: UserInterface,): Promise<any>;
  abstract validateInviteUser(req: UserInterface,inviteUserDTO: InviteUserDTO): Promise<any>;
  abstract invitedUserRegistration(
    invitedUserRegistrationDTO: InvitedUserRegistrationDTO,
    token: string,
  ): Promise<any>;
  abstract verifyOTP(email: string, otp: string): Promise<any>;
  abstract sendOTP(email: string): Promise<any>;
  abstract uploadProfile(
    req: UserInterface,
    files: ProfileImages,
    userInfoId: string,
  ): Promise<any>;

  abstract getProfile(
    id: string,
    path: string,
    res: Response,
    type: string,
  ): Promise<void | StreamableFile>;
  abstract getMember(req: UserInterface,): Promise<any>;
  abstract forgotPassword(email: string): Promise<any>;
  abstract resetPassword(
    token: string,
    resetPasswordDTO: ResetPasswordDto,
  ): Promise<any>;
  abstract changePassword(req: UserInterface, changePasswordDTO: ChangePasswordDto): Promise<any>;
  abstract createPassword(req: UserInterface,createPasswordDto: CreatePasswordDto): Promise<any>;
  abstract getAllUsers(req: UserInterface,): Promise<any>;
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
export interface UserInterface {
  user: User;
}
export interface User {
  email: string;
  sub: string;
}