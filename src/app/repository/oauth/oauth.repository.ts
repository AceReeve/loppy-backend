import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, UpdateQuery, Types } from 'mongoose';
import { Oauth, OauthDocument } from 'src/app/models/oauth/aouth.schema';
import * as _ from 'lodash';
export class OauthRepository {
    constructor(
        @InjectModel(Oauth.name) private oauthModel: Model<OauthDocument>,
    ) { }
    async recordLogin(user: any, signInBy: any): Promise<any> {

        const isExisting = await this.oauthModel.findOne({ email: user.email });
        if (isExisting) {
            await this.oauthModel.findOneAndUpdate({ email: user.email }, { $inc: { login_count: 1 } })
        } else {
            const newUser = new this.oauthModel({
                email: user.email,
                first_name: user.firstName,
                last_name: user.lastName,
                picture: user.picture,
                login_by: signInBy,
                login_count: 1
            });
            await newUser.save();
        }
    }

}