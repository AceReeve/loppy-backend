import { BadRequestException, Inject } from '@nestjs/common';
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
import { AbstractManageTeamRepository } from 'src/app/interface/settings/manage-team';
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

export class ManageTeamRepository implements AbstractManageTeamRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(InvitedMember.name)
    private invitedUserModel: Model<InvitedMemberDocument>,
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
  ) {}

  async inviteMember(inviteMemberDTO: InviteMemberDTO): Promise<any> {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });

    // Check if any of the emails are already invited
    const isInvitedAlready = await this.invitedUserModel.find(
      { 'emails.email': inviteMemberDTO.email },
      'emails.email',
    );
    if (isInvitedAlready.length > 0) {
      const matchedEmails = isInvitedAlready
        .map((doc) => doc.emails.map((emailObj) => emailObj.email))
        .flat();
      throw new BadRequestException(
        `These emails are already invited: ${matchedEmails.join(', ')}.`,
      );
    }

    // Plan validation logic
    const allInvitedByUser = await this.invitedUserModel.findOne({
      invited_by: userData._id,
    });
    if (allInvitedByUser) {
      let totalInvitedEmails = 0;
      allInvitedByUser.emails.forEach((emailObj) => {
        if (emailObj.status !== UserStatus.CANCELLED) {
          totalInvitedEmails++;
        }
      });

      // await this.userRepository.userPlanValidation(
      //   userData._id,
      //   totalInvitedEmails,
      // );
    }

    // Send invitation email
    const payload = { email: inviteMemberDTO.email };
    const access_token = await this.authRepository.generateJWT(
      payload,
      this.configService.get<string>('JWT_EXPIRATION'),
    );
    await this.emailService.inviteUser(inviteMemberDTO.email, access_token);
    const role = await this.roleModel.findById(
      new Types.ObjectId(inviteMemberDTO.role),
    );
    if (!role) {
      throw new BadRequestException(`Role not found`);
    }
    const team = await this.teamModel.findById(
      new Types.ObjectId(inviteMemberDTO.team),
    );
    if (!team) {
      throw new BadRequestException(`team not found`);
    }
    const teamDetails = {
      _id: team._id,
      team: team.team,
      description: team.description,
    };
    // Prepare email object for storage
    const emailObj = {
      email: inviteMemberDTO.email,
      role: role,
      team: teamDetails,
      status: UserStatus.PENDING,
      date: new Date(),
    };

    // Update or create InvitedUser document
    const existingInvitedUser = await this.invitedUserModel.findOne({
      invited_by: userData._id,
    });
    let result: any;
    if (!existingInvitedUser) {
      result = await this.invitedUserModel.create({
        emails: [emailObj],
        invited_by: userData._id,
      });
    } else {
      // Concatenate arrays properly
      const updatedEmails = existingInvitedUser.emails.concat([emailObj]);
      existingInvitedUser.emails = updatedEmails;
      result = await existingInvitedUser.save();
    }

    return result;
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
      createTeamDTO.team_member,
    );

    // Check if all team members exist
    if (users.length !== createTeamDTO.team_member.length) {
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

  async getAllTeam(): Promise<any> {
    const loggedInUser = await this.userRepository.getLoggedInUserDetails();
    return await this.teamModel.find({ created_by: loggedInUser._id });
  }

  async getTeam(id: string): Promise<any> {
    const teamId = new Types.ObjectId(id);

    const pipeline = [
      {
        $match: {
          _id: teamId,
        },
      },
      {
        $lookup: {
          from: 'customRole',
          localField: '_id',
          foreignField: 'team',
          as: 'roles',
        },
      },
    ];

    // Execute the aggregation pipeline
    const result = await this.teamModel.aggregate(pipeline).exec();

    // Since result is an array with potentially one element (if ID is unique), return the first element
    return result[0];
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

  async getAllRole(team_id: string): Promise<any> {
    return await this.customRoleModel.find({ team: team_id });
  }

  async getRole(id: string): Promise<any> {
    const result = await this.customRoleModel.findById(new Types.ObjectId(id));
    return await this.customRoleModel.findOne({ _id: new Types.ObjectId(id) });
  }
}
