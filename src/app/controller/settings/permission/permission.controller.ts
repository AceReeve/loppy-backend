import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminAuthGuard, JwtAuthGuard } from 'src/app/guard/auth';
import {
  CreateTeamDTO,
  CustomRoleDTO,
  InviteMemberDTO,
} from 'src/app/dto/settings/manage-team';
import { AbstractManageTeamService } from 'src/app/interface/settings/manage-team';
@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly manageTeamService: AbstractManageTeamService) {}

  @UseGuards(AdminAuthGuard)
  @Post('role-permission')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create/Update Role Permission' })
  async createTeam(
    @Param('id') id: string,
    @Body() createTeamDTO: CreateTeamDTO,
  ): Promise<any> {
    return this.manageTeamService.createTeam(createTeamDTO);
  }
}
