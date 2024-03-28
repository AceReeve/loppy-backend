import { BadRequestException, Injectable, Inject } from '@nestjs/common';
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
    UserRegisterDTO, UserInfoDTO
} from 'src/app/dto/user';
import * as _ from 'lodash';
import { SignInBy } from 'src/app/const';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
export class UserRepository implements AbstractUserRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,
        @InjectModel(Role.name) private roleDocumentModel: Model<RoleDocument>,
        @Inject(REQUEST) private readonly request: Request,

    ) { }
    async createUser(
        userRegisterDto: UserRegisterDTO,
    ): Promise<any> {
        const newUser = await this.userModel.create({ ...userRegisterDto, login_by: SignInBy.SIGN_IN_BY_SERVICE_HERO, login_count: 1 });
        if (!newUser) throw new BadRequestException('Unable to register user');

        return { newUser };
    }
    async createUserInfo(
        userInfoDTODto: UserInfoDTO,
    ): Promise<any> {
        const user = this.request.user as Partial<User> & { sub: string };
        const userData = await this.userModel.findOne({ email: user.email })
        //set default role
        const role = await this.roleDocumentModel.findOne({ role_name: "Owner" })
        const userInfoDTO = {
            ...userInfoDTODto,
            user_id: userData._id,
            role: role._id,
        };
        const newUserInfo = await this.userInfoModel.create(userInfoDTO);
        if (!newUserInfo) throw new BadRequestException('Unable to register user Information');
        return { newUserInfo };
    }
    async profile(user: Partial<User> & { sub: string }): Promise<any> {
        return await this.userInfoModel.findOne({ user_id: user.sub });
    };
}