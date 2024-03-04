import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, UpdateQuery, Types } from 'mongoose';
import {
    AbstractUserRepository,
    RegisterResponseData,
} from 'src/app/interface/user';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import {
    UserRegisterDTO,
} from 'src/app/dto/user';
import * as _ from 'lodash';
import { UserLoginDTO } from 'src/app/dto/user/index';

export class UserRepository implements AbstractUserRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }


    async createUser(
        userRegisterDto: UserRegisterDTO,
    ): Promise<RegisterResponseData | null> {
        const newUser = new this.userModel(userRegisterDto);
        if (!newUser) throw new BadRequestException('Unable to register user');
        await newUser.save();

        const registeredUser = await this.userModel
            .findOne({ _id: newUser._id })
            .lean();

        return registeredUser;
    }

}