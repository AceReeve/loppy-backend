import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, UpdateQuery, Types } from 'mongoose';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import {
  UserInfo,
  UserInfoDocument,
} from 'src/app/models/user/user-info.schema';
import * as _ from 'lodash';
import { Role, RoleDocument } from 'src/app/models/role/role.schema';
import { DefaultUserRole } from 'src/app/const';
export class OauthRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}
  async recordLogin(user: any, signInBy: any) {
    const isExisting = await this.userModel.findOne({ email: user.email });
    const role = await this.roleModel.findOne({
      role_name: DefaultUserRole.OWNER,
    });
    if (isExisting) {
      await this.userModel.findOneAndUpdate(
        { email: user.email },
        { $inc: { login_count: 1 } },
      );
      return isExisting;
    } else {
      const newUser = new this.userModel({
        email: user.email,
        email_verified: user.email_verified,
        accessToken: user.access_token,
        refreshToken: user.refreshToken,
        id_token: user.id_token,
        expires_in: user.expires_in,
        login_by: signInBy,
        role: role,
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
