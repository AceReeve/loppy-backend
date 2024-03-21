import {
    Injectable, Inject
} from '@nestjs/common';
import * as _ from 'lodash';
import { UserRegisterDTO } from 'src/app/dto/user';
import {
    AbstractUserService, RegisterResponseData,
} from 'src/app/interface/user';
import { AbstractUserRepository } from 'src/app/interface/user';
import { User } from 'src/app/models/user/user.schema';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
@Injectable()
export class UserService implements AbstractUserService {
    constructor(
        private readonly repository: AbstractUserRepository,
        @Inject(REQUEST) private readonly request: Request,

    ) { }

    async createUser(
        userRegisterDto: UserRegisterDTO,
    ): Promise<any> {
        return await this.repository.createUser(userRegisterDto);
    }
    async profile(): Promise<any> {
        const user = this.request.user as Partial<User> & { sub: string };
        return await this.repository.profile(user);
    };
}