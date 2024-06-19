import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiQueryOptions,
} from '@nestjs/swagger';
import {
  UserRegisterDTO,
  UserInfoDTO,
  InviteUserDTO,
  InvitedUserRegistrationDTO,
} from 'src/app/dto/user';
import { AbstractUserService } from 'src/app/interface/user';
import { Public } from '../../decorators/public.decorator';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: AbstractUserService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  async createUser(@Body() userRegisterDto: UserRegisterDTO): Promise<any> {
    return this.userService.createUser(userRegisterDto);
  }

  @Public()
  @Post('send-register-otp')
  @ApiOperation({ summary: 'One Time Password' })
  @ApiQuery({
    name: 'email',
    required: true,
  } as ApiQueryOptions)
  async sendOTP(@Query('email') email: string): Promise<any> {
    return await this.userService.sendOTP(email);
  }

  @Public()
  @Post('verify-otp')
  @ApiOperation({ summary: 'One Time Password' })
  @ApiQuery({
    name: 'email',
    required: true,
  } as ApiQueryOptions)
  @ApiQuery({
    name: 'otp',
    required: true,
  } as ApiQueryOptions)
  async verifyOTP(
    @Query('email') email: string,
    @Query('otp') otp: string,
  ): Promise<any> {
    return await this.userService.verifyOTP(email, otp);
  }

  @Post('user-info')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create user info' })
  async createUserInfo(@Body() userInfoDTO: UserInfoDTO): Promise<any> {
    return this.userService.createUserInfo(userInfoDTO);
  }

  @Get('profile')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get User Profile' })
  async profile(): Promise<any> {
    return this.userService.profile();
  }

  @Get('user/:id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get User Profile' })
  async getUser(@Param('id') id: string): Promise<any> {
    return this.userService.getUser(id);
  }
  @Post('invite-user')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Invite User' })
  async inviteUser(@Body() inviteUserDTO: InviteUserDTO): Promise<any> {
    return this.userService.inviteUser(inviteUserDTO);
  }

  @Post('cancel-invited-user')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Cancel Invited User' })
  @ApiQuery({
    name: 'email',
    required: true,
  } as ApiQueryOptions)
  async cancelInviteUser(@Query('email') email: string): Promise<any> {
    return this.userService.cancelInviteUser(email);
  }

  @Get('get-invited-user')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get Invite User' })
  async getInviteUser(): Promise<any> {
    return this.userService.getInvitedUser();
  }

  @Post('validate-invite-user')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Invite User' })
  async validateInviteUser(@Body() inviteUserDTO: InviteUserDTO): Promise<any> {
    return this.userService.validateInviteUser(inviteUserDTO);
  }

  @Post('invited-user/register')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Invited User Registration' })
  async invitedUserRegistration(
    @Body() invitedUserRegistrationDTO: InvitedUserRegistrationDTO,
  ): Promise<any> {
    return this.userService.invitedUserRegistration(invitedUserRegistrationDTO);
  }
}
