import {
  CreateTeamDTO,
  CustomRoleDTO,
  InviteMemberDTO,
} from 'src/app/dto/settings/manage-team';
import { InviteUserDTO } from 'src/app/dto/user';
import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { UserInterface } from '../../user';

export abstract class AbstractManageTeamRepository {
  abstract createTeam(req: UserInterface,createTeamDTO: CreateTeamDTO): Promise<any>;
  abstract updateTeam(req: UserInterface,createTeamDTO: CreateTeamDTO, id: string): Promise<any>;
  abstract deleteTeam(req: UserInterface,teamId: string): Promise<any>;
  // abstract inviteMember(inviteMemberDTO: InviteMemberDTO): Promise<any>;
  abstract inviteMember(req: UserInterface,inviteUserDTO: InviteUserDTO): Promise<any>;
  abstract deleteTeamMember(req: UserInterface,teamId: string, memberId: string): Promise<any>;
  abstract getAllTeam(req: UserInterface,): Promise<any>;
  abstract getTeam(id: string): Promise<any>;
  abstract customRole(customRoleDTO: CustomRoleDTO): Promise<any>;
  abstract deleteCustomRole(id: string): Promise<any>;
  abstract getAllRole(team_id: string): Promise<any>;
  abstract getRole(id: string): Promise<any>;
  abstract uploadProfile(
    req: UserInterface,
    files: ProfileImages,
    userInfoId: string,
  ): Promise<any>;

  abstract getProfile(
    id: string,
    path: string,
    res: Response,
    type: string,
  ): Promise<void | StreamableFile>;
}

export abstract class AbstractManageTeamService {
  abstract createTeam(req: UserInterface,createTeamDTO: CreateTeamDTO): Promise<any>;
  abstract updateTeam(req: UserInterface,createTeamDTO: CreateTeamDTO, id: string): Promise<any>;
  abstract deleteTeam(req: UserInterface,teamId: string): Promise<any>;
  // abstract inviteMember(inviteMemberDTO: InviteMemberDTO): Promise<any>;
  abstract inviteMember(req: UserInterface,inviteUserDTO: InviteUserDTO): Promise<any>;
  abstract deleteTeamMember(req: UserInterface,teamId: string, memberId: string): Promise<any>;
  abstract getAllTeam(req: UserInterface,): Promise<any>;
  abstract getTeam(id: string): Promise<any>;
  abstract customRole(customRoleDTO: CustomRoleDTO): Promise<any>;
  abstract deleteCustomRole(id: string): Promise<any>;
  abstract getAllRole(team_id: string): Promise<any>;
  abstract getRole(id: string): Promise<any>;
  abstract uploadProfile(
    req: UserInterface,
    files: ProfileImages,
    userInfoId: string,
  ): Promise<any>;

  abstract getProfile(
    id: string,
    path: string,
    res: Response,
    type: string,
  ): Promise<void | StreamableFile>;
}
interface File {
  path: string;
  filename: string;
  mimetype: string;
  created_at: string;
  file_id: any;
  extension: string;
}

export type ProfileImages = {
  image_1: File[];
  image_2: File[];
  image_3: File[];
  image_4: File[];
  image_5: File[];
};
