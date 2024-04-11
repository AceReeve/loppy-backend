import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @Post('invite-user/:email')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Invite User' })
  async inviteUser(@Body() inviteUserDTO: InviteUserDTO): Promise<any> {
    return this.userService.inviteUser(inviteUserDTO);
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
