import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, UpdateQuery, Types } from 'mongoose';
import {
    AbstractUserRepository,
    RegisterResponseData,
} from 'src/app/interface/user';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import { UserInfo, UserInfoDocument } from 'src/app/models/user/user-info.schema';
import { Role, RoleDocument } from 'src/app/models/role/role.schema';
import {
    UserRegisterDTO
} from 'src/app/dto/user';
import * as _ from 'lodash';
export class UserRepository implements AbstractUserRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,
        @InjectModel(Role.name) private roleDocumentModel: Model<RoleDocument>,
    ) { }
    async createUser(
        userRegisterDto: UserRegisterDTO,
    ): Promise<any> {
        if (userRegisterDto._id) {
            const id = new Types.ObjectId(userRegisterDto._id);

            const isValidRole = await this.roleDocumentModel.findById(new Types.ObjectId(userRegisterDto.role));
            if (!isValidRole) { throw new BadRequestException('Role not found') }
            const updatedUser = await this.userModel.findOneAndUpdate(
                { _id: id },
                { $set: userRegisterDto },
                { new: true }
            );
            const updatedUserInfo = await this.userInfoModel.findOneAndUpdate(
                { user_id: id },
                { $set: userRegisterDto.user_information, user_id: updatedUser._id },
                { new: true });

            return { updatedUser, updatedUserInfo };
        } else {

            const isValidRole = await this.roleDocumentModel.findById(new Types.ObjectId(userRegisterDto.role));
            if (!isValidRole) { throw new BadRequestException('Role not found') }
            const newUser = await this.userModel.create(userRegisterDto);
            if (!newUser) throw new BadRequestException('Unable to register user');

            const userInfoDTO = {
                ...userRegisterDto.user_information,
                user_id: newUser._id
            };
            const newUserInfo = await this.userInfoModel.create(userInfoDTO);
            if (!newUserInfo) throw new BadRequestException('Unable to register user Information');
            return { newUser, newUserInfo };
        }
    }

}