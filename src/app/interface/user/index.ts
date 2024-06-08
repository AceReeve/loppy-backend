import { Schema as MongooseSchema, FilterQuery, Document } from 'mongoose';
import { GenericAbstractRepository } from 'src/app/interface/generic.abstract.repository';
import { User } from 'src/app/models/user/user.schema';
import {
  UserRegisterDTO,
  UserInfoDTO,
  InviteUserDTO,
  InvitedUserRegistrationDTO,
} from 'src/app/dto/user';

export abstract class AbstractUserRepository {
  abstract createUser(userRegisterDto: UserRegisterDTO): Promise<any>;
  abstract createUserInfo(userInfoDTO: UserInfoDTO): Promise<any>;
  abstract profile(user: Partial<User> & { sub: string }): Promise<any>;
  abstract getUser(id: string): Promise<any>;
  abstract inviteUser(inviteUserDTO: InviteUserDTO): Promise<any>;
  abstract validateInviteUser(inviteUserDTO: InviteUserDTO): Promise<any>;
  abstract updateUserStripeId(stripeId: string, userId: string): Promise<any>;
  abstract updateWeatherInfoId(
    weatherforecast_id: string,
    userId: string,
  ): Promise<any>;
  abstract invitedUserRegistration(
    invitedUserRegistrationDTO: InvitedUserRegistrationDTO,
  ): Promise<any>;
  abstract verifyOTP(email: string, otp: string): Promise<any>;
  abstract sendOTP(email: string): Promise<any>;
}

export abstract class AbstractUserService {
  abstract createUser(userRegisterDto: UserRegisterDTO): Promise<any>;
  abstract profile(): Promise<any>;
  abstract getUser(id: string): Promise<any>;
  abstract createUserInfo(userInfoDTO: UserInfoDTO): Promise<any>;
  abstract updateUserStripeId(stripeId: string, userId: string): Promise<any>;
  abstract updateWeatherInfoId(
    weatherforecast_id: string,
    userId: string,
  ): Promise<any>;
  abstract inviteUser(inviteUserDTO: InviteUserDTO): Promise<any>;
  abstract validateInviteUser(inviteUserDTO: InviteUserDTO): Promise<any>;
  abstract invitedUserRegistration(
    invitedUserRegistrationDTO: InvitedUserRegistrationDTO,
  ): Promise<any>;
  abstract verifyOTP(email: string, otp: string): Promise<any>;
  abstract sendOTP(email: string): Promise<any>;
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
