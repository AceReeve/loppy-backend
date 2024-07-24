import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as _ from 'lodash';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import {
  UserInfo,
  UserInfoDocument,
} from 'src/app/models/user/user-info.schema';
import { Response } from 'express';
import {
  AbstractManageTeamRepository,
  AbstractManageTeamService,
} from 'src/app/interface/settings/manage-team';
import {
  CreateTeamDTO,
  CustomRoleDTO,
  InviteMemberDTO,
} from 'src/app/dto/settings/manage-team';
@Injectable()
export class ManageTeamService implements AbstractManageTeamService {
  constructor(private readonly repository: AbstractManageTeamRepository) {}

  async inviteMember(inviteMemberDTO: InviteMemberDTO): Promise<any> {
    return await this.repository.inviteMember(inviteMemberDTO);
  }

  async createTeam(createTeamDTO: CreateTeamDTO): Promise<any> {
    return await this.repository.createTeam(createTeamDTO);
  }
  async getAllTeam(): Promise<any> {
    return await this.repository.getAllTeam();
  }
  async getTeam(id: string): Promise<any> {
    return await this.repository.getTeam(id);
  }

  async customRole(customRoleDTO: CustomRoleDTO): Promise<any> {
    return await this.repository.customRole(customRoleDTO);
  }
  async getAllRole(team_id: string): Promise<any> {
    return await this.repository.getAllRole(team_id);
  }
  async getRole(id: string): Promise<any> {
    return await this.repository.getRole(id);
  }
}
