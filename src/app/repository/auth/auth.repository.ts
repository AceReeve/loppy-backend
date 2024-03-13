import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, UpdateQuery, Types } from 'mongoose';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import * as bcrypt from 'bcrypt';
import { UserLoginDTO } from 'src/app/dto/user/index';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthRepository {

    constructor(
        private readonly jwtService: JwtService,
        private configService: ConfigService,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }
    async validateUser(email: string, password: string): Promise<User | null> {
        try {
            let user: User | any;
            user = await this.userModel.findOne({ email: email });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                throw new BadRequestException('Incorrect Password');
            }
            return user;
        } catch (error) {
            throw new BadRequestException('Incorrect Email or Password');
        }
    }
    generateJWT(payload: object, exp: string): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_EXPIRATION')
        });
    }
    async login(userLoginDTO: UserLoginDTO) {
        try {
            let user: User | any;
            user = await this.validateUser(userLoginDTO.email, userLoginDTO.password);
            const { _id, first_name, last_name, email, status } = user;
            const payload = { email: user.email, sub: user._id };
            const access_token = this.generateJWT(payload, this.configService.get<string>('JWT_EXPIRATION'));
            await this.userModel.findOneAndUpdate({ email: email }, { $inc: { login_count: 1 } })
            return { _id, first_name, last_name, email, status, access_token };
        } catch (error) {
            throw new BadRequestException('Incorrect Email or Password12');
        }
    }
}
