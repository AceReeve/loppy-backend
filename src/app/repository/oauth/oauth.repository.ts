import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, UpdateQuery, Types } from 'mongoose';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import {
  UserInfo,
  UserInfoDocument,
} from 'src/app/models/user/user-info.schema';
import * as _ from 'lodash';
export class OauthRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,
  ) {}
  async recordLogin(user: any, signInBy: any) {
    const isExisting = await this.userModel.findOne({ email: user.email });
    if (isExisting) {
      console.log('existing');
      await this.userModel.findOneAndUpdate(
        { email: user.email },
        { $inc: { login_count: 1 } },
      );
      return isExisting;
    } else {
      console.log('new user!', user);
      const newUser = new this.userModel({
        email: user.email,
        email_verified: user.email_verified,
        accessToken: user.access_token,
        refreshToken: user.refreshToken,
        id_token: user.id_token,
        expires_in: user.expires_in,
        login_by: signInBy,
        login_count: 1,
      });
      await newUser.save();
      const newUserInfo = new this.userInfoModel({
        first_name: user.firstName,
        last_name: user.lastName,
        picture: user.picture,
        user_id: newUser._id,
      });
      await newUserInfo.save();
      return newUserInfo;
    }
  }
}
