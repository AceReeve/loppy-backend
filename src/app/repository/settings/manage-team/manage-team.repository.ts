import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  StreamableFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, UpdateQuery, Types } from 'mongoose';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import * as _ from 'lodash';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { EmailerService } from '@util/emailer/emailer';
import { UserStatus } from 'src/app/const';
import { AuthRepository } from '../../auth/auth.repository';
import { ConfigService } from '@nestjs/config';
import {
  AbstractManageTeamRepository,
  ProfileImages,
} from 'src/app/interface/settings/manage-team';
import {
  CreateTeamDTO,
  CustomRoleDTO,
  InviteMemberDTO,
} from 'src/app/dto/settings/manage-team';
import { UserRepository } from '../../user/user.repository';
import {
  InvitedMember,
  InvitedMemberDocument,
} from 'src/app/models/settings/manage-team/invite-member/manage-team.schema';
import {
  Team,
  TeamDocument,
} from 'src/app/models/settings/manage-team/team/team.schema';
import { Role, RoleDocument } from 'src/app/models/role/role.schema';
import { error } from 'console';
import {
  CustomeRole,
  CustomeRoleDocument,
} from 'src/app/models/settings/manage-team/custom-role/custom-role.schema';
import { InviteUserDTO } from 'src/app/dto/user';
import { InvitedUserDocument } from 'src/app/models/invited-users/invited-users.schema';
import { S3Service } from 'src/app/services/s3/s3.service';
import {
  FileUpload,
  FileUploadDocument,
} from 'src/app/models/file-upload/file-upload.schema';
import { Response } from 'express';

export class ManageTeamRepository implements AbstractManageTeamRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(InvitedMember.name)
    private invitedUserModel: Model<InvitedUserDocument>,
    @InjectModel(Team.name)
    private teamModel: Model<TeamDocument>,
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
    @InjectModel(CustomeRole.name)
    private customRoleModel: Model<CustomeRoleDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly emailService: EmailerService,
    private readonly authRepository: AuthRepository,
    private configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly s3: S3Service,
    @InjectModel(FileUpload.name)
    private fileUploadModel: Model<FileUploadDocument>,
  ) {}

  // async inviteMember(inviteMemberDTO: InviteMemberDTO): Promise<any> {
  //   const user = this.request.user as Partial<User> & { sub: string };
  //   const userData = await this.userModel.findOne({ email: user.email });

  //   // Check if any of the emails are already invited
  //   const isInvitedAlready = await this.invitedUserModel.find(
  //     { 'emails.email': inviteMemberDTO.email },
  //     'emails.email',
  //   );
  //   if (isInvitedAlready.length > 0) {
  //     const matchedEmails = isInvitedAlready
  //       .map((doc) => doc.emails.map((emailObj) => emailObj.email))
  //       .flat();
  //     throw new BadRequestException(
  //       `These emails are already invited: ${matchedEmails.join(', ')}.`,
  //     );
  //   }

  //   // Plan validation logic
  //   const allInvitedByUser = await this.invitedUserModel.findOne({
  //     invited_by: userData._id,
  //   });
  //   if (allInvitedByUser) {
  //     let totalInvitedEmails = 0;
  //     allInvitedByUser.emails.forEach((emailObj) => {
  //       if (emailObj.status !== UserStatus.CANCELLED) {
  //         totalInvitedEmails++;
  //       }
  //     });

  //     // await this.userRepository.userPlanValidation(
  //     //   userData._id,
  //     //   totalInvitedEmails,
  //     // );
  //   }

  //   // Send invitation email
  //   const payload = { email: inviteMemberDTO.email };
  //   const access_token = await this.authRepository.generateJWT(
  //     payload,
  //     this.configService.get<string>('JWT_EXPIRATION'),
  //   );
  //   await this.emailService.inviteUser(inviteMemberDTO.email, access_token);
  //   const role = await this.roleModel.findById(
  //     new Types.ObjectId(inviteMemberDTO.role),
  //   );
  //   if (!role) {
  //     throw new BadRequestException(`Role not found`);
  //   }
  //   const team = await this.teamModel.findById(
  //     new Types.ObjectId(inviteMemberDTO.team),
  //   );
  //   if (!team) {
  //     throw new BadRequestException(`team not found`);
  //   }
  //   const teamDetails = {
  //     _id: team._id,
  //     team: team.team,
  //     description: team.description,
  //   };
  //   // Prepare email object for storage
  //   const emailObj = {
  //     email: inviteMemberDTO.email,
  //     role: role,
  //     team: teamDetails,
  //     status: UserStatus.PENDING,
  //     date: new Date(),
  //   };

  //   // Update or create InvitedUser document
  //   const existingInvitedUser = await this.invitedUserModel.findOne({
  //     invited_by: userData._id,
  //   });
  //   let result: any;
  //   if (!existingInvitedUser) {
  //     result = await this.invitedUserModel.create({
  //       emails: [emailObj],
  //       invited_by: userData._id,
  //     });
  //   } else {
  //     // Concatenate arrays properly
  //     const updatedEmails = existingInvitedUser.emails.concat([emailObj]);
  //     existingInvitedUser.emails = updatedEmails;
  //     result = await existingInvitedUser.save();
  //   }

  //   return result;
  // }
  async inviteMember(inviteUserDTO: InviteUserDTO): Promise<any> {
    return await this.userRepository.inviteUser(inviteUserDTO);
  }
  async createTeam(createTeamDTO: CreateTeamDTO): Promise<any> {
    // Fetch logged-in user details (assuming you have a method like this in userRepository)
    const loggedInUser = await this.userRepository.getLoggedInUserDetails();
    // validate team if already existing
    const isTeamExisting = await this.teamModel.findOne({
      created_by: loggedInUser._id,
      team: createTeamDTO.team,
    });

    if (isTeamExisting) {
      throw new BadRequestException(
        `Team '${isTeamExisting.team}' already exists.`,
      );
    }

    // Fetch details of invited team members
    const { users, userInfos } = await this.userRepository.findUsersByIds(
      createTeamDTO.team_members,
    );

    // Check if all team members exist
    if (users.length !== createTeamDTO.team_members.length) {
      throw new BadRequestException('One or more team members not found');
    }

    // Prepare team members with necessary details
    const teamMembers = await Promise.all(
      users.map(async (user) => {
        // Find corresponding userInfo for the current user
        const userInfo = userInfos.find(
          (info) => info.user_id.toString() === user._id.toString(),
        );

        // Fetch role details for the current user
        const roleDetails = await this.roleModel
          .findOne({ _id: user.role })
          .exec();

        return {
          user_id: user._id.toString(),
          first_name: userInfo ? userInfo.first_name : '',
          last_name: userInfo ? userInfo.last_name : '',
          email: user.email,
          role: roleDetails || undefined,
        };
      }),
    );
    // Create new team document
    const newTeam = await this.teamModel.create({
      team: createTeamDTO.team,
      description: createTeamDTO.description,
      team_members: teamMembers,
      created_by: loggedInUser._id,
    });

    return newTeam;
  }
  async updateTeam(createTeamDTO: CreateTeamDTO, id: string): Promise<any> {
    const loggedInUser = await this.userRepository.getLoggedInUserDetails();
    // Fetch existing team
    const existingTeam = await this.teamModel.findOne({
      _id: new Types.ObjectId(id),
      created_by: loggedInUser._id,
    });
    if (!existingTeam) {
      throw new BadRequestException(
        'Team not found or you do not have permission to update this team',
      );
    }
    // Fetch accepted users
    const acceptedUsers = await this.userRepository.getAcceptedInvitedUser();

    // Create a Set of accepted user IDs for quick lookup
    const acceptedUserIds = new Set(
      acceptedUsers.map((user) => user.user_id.toString()),
    );
    // Validate and check for duplicates
    const memberIds = createTeamDTO.team_members || [];
    const seenMemberIds = new Set<string>();
    const duplicateIds = new Set<string>();
    // Validate team member IDs
    if (createTeamDTO.team_members && createTeamDTO.team_members.length > 0) {
      for (const memberId of createTeamDTO.team_members) {
        if (!acceptedUserIds.has(memberId)) {
          throw new BadRequestException(
            `User with ID ${memberId} is not an accepted member`,
          );
        }
        if (seenMemberIds.has(memberId)) {
          duplicateIds.add(memberId);
        } else {
          seenMemberIds.add(memberId);
        }
      }

      if (duplicateIds.size > 0) {
        throw new BadRequestException(
          `Duplicate user IDs found: ${Array.from(duplicateIds).join(', ')}`,
        );
      }
    }

    // Update team details
    // existingTeam.team_members = createTeamDTO.team_members; // do not remove members when updating the team settings
    existingTeam.team = createTeamDTO.team;
    existingTeam.description = createTeamDTO.description;

    // Save updated team
    await existingTeam.save();

    return existingTeam;
  }

  async deleteTeamMember(teamId: string, memberId: string): Promise<any> {
    const loggedInUser = await this.userRepository.getLoggedInUserDetails();

    // Fetch existing team
    const existingTeam = await this.teamModel.findOne({
      _id: new Types.ObjectId(teamId),
      created_by: loggedInUser._id,
    });

    if (!existingTeam) {
      throw new BadRequestException(
        'Team not found or you do not have permission to update this team',
      );
    }

    // Check if member exists in the team
    const memberIndex = existingTeam.team_members.findIndex(
      (member: any) => member._id.toString() === memberId,
    );

    if (memberIndex === -1) {
      throw new BadRequestException('Member not found in the team');
    }

    // Remove the member from the team
    existingTeam.team_members.splice(memberIndex, 1);

    // Save the updated team
    await existingTeam.save();

    return existingTeam;
  }

  async getAllTeam(): Promise<any> {
    const loggedInUser = await this.userRepository.getLoggedInUserDetails();

    const teams = await this.teamModel
      .find({ created_by: loggedInUser._id })
      .exec();

    const teamsWithMemberDetails = await Promise.all(
      teams.map(async (team) => {
        // Extract user IDs from the team
        const userIds = team.team_members.map(
          (id: any) => new Types.ObjectId(id),
        );

        const users = await this.userModel
          .find({ _id: { $in: userIds } })
          .exec();

        const teamMembers = users.map((user) => ({
          _id: user._id,
          email: user.email,
          role_name: (user.role as any)?.role_name,
          status: user.status,
        }));

        return {
          _id: team._id,
          team: team.team,
          description: team.description,
          created_by: team.created_by,
          created_at: team.created_at,
          updated_at: team.updated_at,
          profile: team.profile,
          team_members: teamMembers,
        };
      }),
    );
    return teamsWithMemberDetails;
  }

  async getTeam(id: string): Promise<any> {
    const team = await this.teamModel.findOne({ _id: id }).exec();
    const userIds = team.team_members.map((id: any) => id);

    const users = await this.userModel.find({ _id: { $in: userIds } }).exec();
    const teamMembers = users.map((user) => ({
      _id: user._id,
      email: user.email,
      role_name: (user.role as any)?.role_name,
      status: user.status,
    }));

    const totalMembers = teamMembers.length;

    const roleCounts: { [key: string]: number } = {};
    teamMembers.forEach((member) => {
      if (!roleCounts[member.role_name]) {
        roleCounts[member.role_name] = 0;
      }
      roleCounts[member.role_name]++;
    });

    const roles = Object.keys(roleCounts).map((roleName) => ({
      role_name: roleName,
      count: roleCounts[roleName],
    }));

    const roleCount = await this.customRoleModel.find({ team: id }).exec();

    return {
      _id: team._id,
      team: team.team,
      description: team.description,
      created_by: team.created_by,
      created_at: team.created_at,
      updated_at: team.updated_at,
      profile: team.profile,
      team_members: teamMembers,
      overview: {
        members: totalMembers,
        roles: roleCount.length,
      },
      roles: roles,
    };
  }

  async customRole(customRoleDTO: CustomRoleDTO): Promise<any> {
    const validateteam = await this.teamModel.findById(
      new Types.ObjectId(customRoleDTO.team),
    );
    if (!validateteam) {
      throw new BadRequestException(`Team '${customRoleDTO.team}' not found.`);
    }
    const validateRole = await this.customRoleModel.findOne({
      role: customRoleDTO.role,
    });
    if (validateRole) {
      throw new BadRequestException(
        `Role '${customRoleDTO.role}' already exists.`,
      );
    }
    const newRole = await this.customRoleModel.create({
      role: customRoleDTO.role,
      description: customRoleDTO.description,
      team: customRoleDTO.team,
    });
    if (!newRole) {
      throw new BadRequestException(`failed to create role.`);
    }
    return newRole;
  }

  async deleteCustomRole(id: string): Promise<any> {
    return await this.customRoleModel.findByIdAndDelete(id);
  }

  async getAllRole(team_id: string): Promise<any> {
    return await this.customRoleModel.find({ team: team_id });
  }

  async getRole(id: string): Promise<any> {
    const result = await this.customRoleModel.findById(new Types.ObjectId(id));
    return await this.customRoleModel.findOne({ _id: new Types.ObjectId(id) });
  }

  ////////////////////
  async uploadProfile(
    files: ProfileImages,
    team_id: string,
  ): Promise<any | null> {
    const images: any = {};
    const user = await this.userRepository.getLoggedInUserDetails();
    console.log('files', files);
    if (files === undefined)
      throw new BadRequestException('Image files cannot be empty.');

    if (files) {
      // s3 bucket upload and insertion in fileuploads collection
      const s3 = await this.UploadtoS3Bucket(files, team_id);

      for (const image of Object.keys(s3)) {
        images[image] = s3[image];
      }
    }

    await this.teamModel.findOneAndUpdate(
      { _id: team_id },
      { $set: { profile: {} } },
    );

    return await this.teamModel.findOneAndUpdate(
      { _id: team_id },
      {
        $set: {
          profile: images,
        },
      },
      { new: true },
    );
  }

  private async UploadtoS3Bucket(files: any, id: string): Promise<any> {
    const domain = this.getDomainHost(id.toString());
    const today = new Date();

    const uploadedFiles: any = {};

    for (const key of Object.keys(files)) {
      const file = files[key][0];

      if (!file) continue;

      const { originalname, mimetype, fieldname } = file;
      const parts = originalname.split('.');
      const s3Route = this.s3.defaultImagePath(id, originalname);
      try {
        const defaultPhotoPath = await this.s3.uploadImage(file, s3Route);

        if (!defaultPhotoPath)
          throw new InternalServerErrorException(
            'Unable to upload document to S3 Bucket',
          );

        const fileUpload = await this.fileUploadModel.create({
          original_filename: originalname,
          extension: parts[parts.length - 1],
          name: fieldname,
          mimetype: mimetype,
          path: defaultPhotoPath,
        });

        const fileInformation = {
          path: `${domain}/${defaultPhotoPath.replace(
            `/${originalname}`,
            '',
          )}?type=${file.fieldname}`,
          filename: originalname,
          mimetype: mimetype,
          created_at: today.toISOString(),
          file_id: fileUpload?._id,
          extension: fileUpload.extension,
        };

        uploadedFiles[key] = fileInformation;
      } catch (error) {
        console.error(`Error processing file ${key}:`, error);
        throw new InternalServerErrorException(`Error processing file ${key}`);
      }
    }

    return uploadedFiles;
  }

  private host = this.configService.get<string>('HOST');
  private getDomainHost(id: string): string {
    return `${this.host}/api/manage-team/images/${id}/image`;
  }

  async getProfile(
    id: string,
    path: string,
    res: Response,
    type: string,
  ): Promise<void | StreamableFile> {
    let streamFileDetails = { mimetype: '', filename: '', path: '' };

    streamFileDetails = await this.getImageInfo(type, id, path);

    if (
      _.isEmpty(streamFileDetails?.filename) &&
      _.isEmpty(streamFileDetails?.mimetype)
    )
      throw new BadRequestException('Unable to find file!');

    const readStream = this.s3.downloadFile(streamFileDetails?.path);
    if (!readStream)
      throw new InternalServerErrorException(
        'Unable to download file from S3!',
      );

    res.set('Content-Type', `${streamFileDetails?.mimetype}`);
    res.set(
      'Content-Disposition',
      `attachment; filename="${streamFileDetails?.filename}"`,
    );

    return new StreamableFile(readStream);
  }

  private async getImageInfo(
    type: string,
    id: string,
    path: string,
  ): Promise<any> {
    const team = await this.teamModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!team)
      throw new BadRequestException(`Invalid user information id: ${id}`);

    const { profile } = team;

    const image = profile[type];

    if (!image) throw new BadRequestException(`Invalid document image`);

    const filename = image?.filename ?? '';

    const result = {
      file: this.getDomainHost(id) + '/' + path + '?type=' + type,
      filename,
      mimetype: image?.mimetype ?? '',
      path: `${path}/${filename}`,
    };
    return result;
  }
}
