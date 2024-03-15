import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, UpdateQuery, Types } from 'mongoose';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import { UserInfo, UserInfoDocument } from 'src/app/models/user/user-info.schema';
import * as _ from 'lodash';
export class OauthRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,
    ) { }
    async recordLogin(user: any, signInBy: any): Promise<any> {

        const isExisting = await this.userModel.findOne({ email: user.email });
        if (isExisting) {
            await this.userModel.findOneAndUpdate({ email: user.email }, { $inc: { login_count: 1 } })
        } else {
            const newUser = new this.userModel({
                email: user.email,
                login_by: signInBy,
                login_count: 1
            });
            await newUser.save();
            const newUserInfo = new this.userInfoModel({
                first_name: user.firstName,
                last_name: user.lastName,
                picture: user.picture,
                user_id: newUser._id
            })
            await newUserInfo.save();
        }
    }

}