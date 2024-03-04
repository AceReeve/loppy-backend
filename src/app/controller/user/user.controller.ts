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
    UserRegisterDTO,
} from 'src/app/dto/user';
import {
    AbstractUserService,
    RegisterResponseData,
} from 'src/app/interface/user';
import { JwtAuthGuard } from 'src/app/guard/auth';
@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: AbstractUserService) { }

    @Post('register')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Bearer')
    @ApiBody({ type: UserRegisterDTO })
    @ApiOperation({ summary: 'Register user' })
    @ApiResponse({
        status: 200,
        description: 'User Created',
    })
    @ApiResponse({
        status: 500,
        description: 'An internal error occured',
    })
    @ApiResponse({
        status: 400,
        description: 'Missing Required Fields - Bad Request',
    })
    async createUser(
        @Body() userRegisterDto: UserRegisterDTO,
    ): Promise<RegisterResponseData | null> {
        return this.userService.createUser(userRegisterDto);
    }
}
