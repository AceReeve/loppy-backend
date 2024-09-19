import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
  Query,
  Res,
  StreamableFile,
  UploadedFiles,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AdminAuthGuard, JwtAuthGuard } from 'src/app/guard/auth';
import {
  CreateTeamDTO,
  CustomRoleDTO,
  InviteMemberDTO,
} from 'src/app/dto/settings/manage-team';
import {
  AbstractManageTeamService,
  ProfileImages,
} from 'src/app/interface/settings/manage-team';
import { InviteUserDTO, ProfileImageType } from 'src/app/dto/user';
import { UserRepository } from 'src/app/repository/user/user.repository';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileUploadPipe } from 'src/app/pipes/file-upload.pipe';
import { Public } from 'src/app/decorators/public.decorator';
import { Response } from 'express';

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
  @Delete('team/:teamId')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete Team' })
  async deleteTeam(@Param('teamId') teamId: string): Promise<any> {
    return this.manageTeamService.deleteTeam(teamId);
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
  @Delete('team-member/:teamId/:memberId')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete Team Member' })
  async deleteTeamMember(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
  ): Promise<any> {
    return this.manageTeamService.deleteTeamMember(teamId, memberId);
  }

  @UseGuards(AdminAuthGuard)
  @Post('custom-role')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create Custom Role' })
  async customRole(@Body() customRoleDTO: CustomRoleDTO): Promise<any> {
    return this.manageTeamService.customRole(customRoleDTO);
  }

  @UseGuards(AdminAuthGuard)
  @Delete('custom-role/:id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Delete Custom Role' })
  async deleteCustomRole(@Param('id') id: string): Promise<any> {
    return this.manageTeamService.deleteCustomRole(id);
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

  @UseGuards(JwtAuthGuard)
  @Post('upload-profile')
  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'Update Team Profile Picture',
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image_1' }]))
  @ApiConsumes('multipart/form-data')
  async updateUserProfile(
    @UploadedFiles(FileUploadPipe) files: ProfileImages,
    @Query('id') id?: string,
  ) {
    if (!id) id = '';
    return await this.manageTeamService.uploadProfile(files, id);
  }

  @Public()
  @Get('images/:id/image/:path(*)')
  @ApiOperation({ summary: 'Get catalog item default image' })
  async getProfile(
    @Param('id') id: string,
    @Param('path') path: string,
    @Res({ passthrough: true }) res: Response,
    @Query() { type }: ProfileImageType,
  ): Promise<StreamableFile | void> {
    return await this.manageTeamService.getProfile(id, path, res, type);
  }
}
