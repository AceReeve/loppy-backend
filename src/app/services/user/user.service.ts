import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as _ from 'lodash';
import { UserRegisterDTO, UserInfoDTO } from 'src/app/dto/user';
import { AbstractUserService } from 'src/app/interface/user';
import { AbstractUserRepository } from 'src/app/interface/user';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { UserInfo, UserInfoDocument } from 'src/app/models/user/user-info.schema';

@Injectable()
export class UserService implements AbstractUserService {
    constructor(
        private readonly repository: AbstractUserRepository,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @Inject(REQUEST) private readonly request: Request,
        @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,


    ) { }

    async createUser(
        userRegisterDto: UserRegisterDTO,
    ): Promise<any> {
        return await this.repository.createUser(userRegisterDto);
    }
    async createUserInfo(
        userInfoDTO: UserInfoDTO,
    ): Promise<any> {
        return await this.repository.createUserInfo(userInfoDTO);
    }

    async profile(): Promise<any> {
        const user = this.request.user as Partial<User> & { sub: string };
        return await this.repository.profile(user);
    };

    async findByUserId(userId: string) {
        const userInfo = await this.userInfoModel.findOne({ user_id: userId })
        return userInfo;
    }
}