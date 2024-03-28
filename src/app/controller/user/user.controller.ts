import {
    Controller,
    Post,
    Body,
    Get,
    Request,
    UseGuards,
    Put,
    Param,
    Query,
    Delete,
    Req,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {
    UserRegisterDTO, UserInfoDTO
} from 'src/app/dto/user';
import {
    AbstractUserService,
    RegisterResponseData,
} from 'src/app/interface/user';
import { JwtAuthGuard } from 'src/app/guard/auth';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: AbstractUserService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register user' })
    async createUser(
        @Body() userRegisterDto: UserRegisterDTO,
    ): Promise<any> {
        return this.userService.createUser(userRegisterDto);
    }


    @Post('user-info')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Bearer')
    @ApiOperation({ summary: 'Create user info' })
    async createUserInfo(
        @Body() userInfoDTO: UserInfoDTO,
    ): Promise<any> {
        return this.userService.createUserInfo(userInfoDTO);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Bearer')
    @ApiOperation({ summary: 'Get User Profile' })
    async profile(): Promise<any> {
        return this.userService.profile();
    }
}
