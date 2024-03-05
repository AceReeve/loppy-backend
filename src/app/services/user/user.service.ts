import {
    Injectable,
} from '@nestjs/common';
import * as _ from 'lodash';
import { UserRegisterDTO } from 'src/app/dto/user';
import {
    AbstractUserService, RegisterResponseData,
} from 'src/app/interface/user';
import { AbstractUserRepository } from 'src/app/interface/user';


@Injectable()
export class UserService implements AbstractUserService {
    constructor(
        private readonly repository: AbstractUserRepository,
    ) { }

    async createUser(
        userRegisterDto: UserRegisterDTO,
    ): Promise<any> {
        return await this.repository.createUser(userRegisterDto);
    }
}