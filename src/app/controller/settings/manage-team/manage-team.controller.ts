import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminAuthGuard, JwtAuthGuard } from 'src/app/guard/auth';
import {
  CreateTeamDTO,
  CustomRoleDTO,
  InviteMemberDTO,
} from 'src/app/dto/settings/manage-team';
import { AbstractManageTeamService } from 'src/app/interface/settings/manage-team';
import { InviteUserDTO } from 'src/app/dto/user';
import { UserRepository } from 'src/app/repository/user/user.repository';
@ApiTags('Manage Team')
@Controller('manage-team')
export class ManageTeamController {
  constructor(
    private readonly manageTeamService: AbstractManageTeamService,
    private readonly userRepository: UserRepository,
  ) {}

  @UseGuards(AdminAuthGuard)
  @Post('team')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create Team' })
  async createTeam(@Body() createTeamDTO: CreateTeamDTO): Promise<any> {
    return this.manageTeamService.createTeam(createTeamDTO);
  }

  @UseGuards(AdminAuthGuard)
  @Put('team/:id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Update Team' })
  async updateTeam(
    @Param('id') id: string,
    @Body() createTeamDTO: CreateTeamDTO,
  ): Promise<any> {
    return this.manageTeamService.updateTeam(createTeamDTO, id);
  }

  @UseGuards(AdminAuthGuard)
  @Get('teams')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'List of All Team' })
  async getAllTeam(): Promise<any> {
    return this.manageTeamService.getAllTeam();
  }

  @UseGuards(AdminAuthGuard)
  @Get('team/:id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get Team By ID' })
  async getTeam(@Param('id') id: string): Promise<any> {
    return this.manageTeamService.getTeam(id);
  }

  @UseGuards(AdminAuthGuard)
  @Post('invite-member')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Invite User' })
  async inviteUser(@Body() inviteUserDTO: InviteUserDTO): Promise<any> {
    return this.manageTeamService.inviteMember(inviteUserDTO);
  }

  @UseGuards(AdminAuthGuard)
  @Post('custom-role')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create Custom Role' })
  async customRole(@Body() customRoleDTO: CustomRoleDTO): Promise<any> {
    return this.manageTeamService.customRole(customRoleDTO);
  }

  @UseGuards(AdminAuthGuard)
  @Get('role/:id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get Role By ID' })
  async getRole(@Param('id') id: string): Promise<any> {
    return this.manageTeamService.getRole(id);
  }

  @UseGuards(AdminAuthGuard)
  @Get('role/all/:team_id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'List of All Role' })
  async getAllRole(@Param('team_id') team_id: string): Promise<any> {
    return this.manageTeamService.getAllRole(team_id);
  }

  @UseGuards(AdminAuthGuard)
  @Get('available-seats')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Available Seats' })
  async getAvailableSeats(): Promise<any> {
    return this.userRepository.availableSeats();
  }
}
