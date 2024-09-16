import {
  BadRequestException,
  Injectable,
  Inject,
  StreamableFile,
  InternalServerErrorException,
  ConsoleLogger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, UpdateQuery, Types } from 'mongoose';
import {
  AbstractUserRepository,
  ProfileImages,
  RegisterResponseData,
} from 'src/app/interface/user';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import {
  UserInfo,
  UserInfoDocument,
} from 'src/app/models/user/user-info.schema';
import { Role, RoleDocument } from 'src/app/models/role/role.schema';
import {
  UserRegisterDTO,
  UserInfoDTO,
  InviteUserDTO,
  InvitedUserRegistrationDTO,
  ResetPasswordDto,
  ChangePasswordDto,
} from 'src/app/dto/user';
import * as _ from 'lodash';
import { DefaultUserRole, SignInBy } from 'src/app/const';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { EmailerService } from '@util/emailer/emailer';
import { StripeEvent } from 'src/app/models/stripe/stripe.event.schema';
import {
  InvitedUser,
  InvitedUserDocument,
} from 'src/app/models/invited-users/invited-users.schema';
import { UserStatus } from 'src/app/const';
import { AuthRepository } from '../auth/auth.repository';
import { ConfigService } from '@nestjs/config';
import { UserRole, PlanSubscription } from 'src/app/const';
import { WeatherForecast } from 'src/app/models/weatherforecast/weatherforecast.schema';
import { Otp, OtpDocument } from 'src/app/models/otp/otp.schema';
import {
  FileUpload,
  FileUploadDocument,
} from 'src/app/models/file-upload/file-upload.schema';
import { S3Service } from 'src/app/services/s3/s3.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OrganizationDTO } from 'src/app/dto/messaging-twilio';
import {
  Team,
  TeamDocument,
} from 'src/app/models/settings/manage-team/team/team.schema';

export class UserRepository implements AbstractUserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,
    @InjectModel(Role.name) private roleDocumentModel: Model<RoleDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    @InjectModel(StripeEvent.name) private stripeEventModel: Model<StripeEvent>,
    @InjectModel(WeatherForecast.name)
    private weatherforecastModel: Model<StripeEvent>,
    @InjectModel(InvitedUser.name)
    private invitedUserModel: Model<InvitedUserDocument>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly emailService: EmailerService,
    private readonly authRepository: AuthRepository,
    private configService: ConfigService,
    @InjectModel(FileUpload.name)
    private fileUploadModel: Model<FileUploadDocument>,
    @InjectModel(Team.name)
    private teamModel: Model<TeamDocument>,
    private readonly s3: S3Service,
    private readonly jwtService: JwtService,
  ) {}

  async getLoggedInUserDetails(): Promise<any> {
    const user = this.request.user as Partial<User> & { sub: string };
    return await this.userModel.findOne({ email: user.email });
  }

  async validateResetPassToken(token: string): Promise<any> {
    const userDetails = await this.userModel.findOne({
      reset_password_token: token,
    });
    if (!userDetails || userDetails.reset_password_token !== token) {
      throw new BadRequestException('Invalid Token');
    }
  }

  async userData(id: string): Promise<any> {
    const userDetails = await this.userModel.findOne({
      _id: new Types.ObjectId(id),
    });
    return userDetails;
  }
  async createUser(userRegisterDto: UserRegisterDTO): Promise<any> {
    // await this.verifyOTP(userRegisterDto.email, userRegisterDto.otp);

    const validateEmail = await this.userModel.findOne({
      email: userRegisterDto.email,
    });
    if (validateEmail) {
      throw new BadRequestException('Email is already Registered');
    }
    // Remove OTP after verification
    const isverified = await this.otpModel.findOne({
      email: userRegisterDto.email,
    });
    if (!isverified || isverified.verified_email != true) {
      throw new BadRequestException('Email is not yet Verified');
    }
    await this.otpModel.deleteOne({
      email: userRegisterDto.email,
    });
    // if (userRegisterDto.password != userRegisterDto.confirm_password) {
    //   // Confirm passwords match
    //   throw new BadRequestException('Password Does Not Match');
    // }
    const role = await this.roleDocumentModel.findOne({
      role_name: DefaultUserRole.OWNER,
    });
    const newUser = await this.userModel.create({
      email: userRegisterDto.email,
      password: userRegisterDto.password,
      verified_email: true,
      login_by: SignInBy.SIGN_IN_BY_SERVICE_HERO,
      login_count: 1,
      role: role,
    });

    if (!newUser) throw new BadRequestException('Unable to register user');

    return { newUser };
  }

  async changePassword(dto: ChangePasswordDto): Promise<any> {
    const user = await this.getLoggedInUserDetails();
    const passwordMatch = await bcrypt.compare(
      dto.current_pasword,
      user.password,
    );
    if (!passwordMatch) {
      throw new BadRequestException('Incorrect Password');
    }
    if (!dto.new_password) {
      throw new BadRequestException('New password is required');
    }
    const password = await bcrypt.hash(dto.new_password, 12);
    const newUser = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          password: password,
        },
      },
      {
        new: true,
      },
    );
    return newUser;
  }

  async createUserInfo(userInfoDTODto: UserInfoDTO): Promise<any> {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    const userInfoDTO = {
      ...userInfoDTODto,
      user_id: userData._id,
    };
    const userInfo = await this.userInfoModel.findOne({
      user_id: userData._id,
    });
    let result: any;
    if (userInfo) {
      result = await this.userInfoModel.findOneAndUpdate(
        {
          user_id: userData._id,
        },
        {
          $set: {
            ...userInfoDTODto,
          },
        },
      );
    } else {
      result = await this.userInfoModel.create(userInfoDTO);
    }
    //update the invitation documents
    const updateIvitedUser = await this.invitedUserModel.findOneAndUpdate(
      { 'users.email': user.email },
      //update status for specific email that matches to invited user
      {
        $set: {
          'users.$.first_name': userInfoDTO.first_name,
          'users.$.last_name': userInfoDTO.last_name,
        },
      },
      { new: true },
    );

    if (!result) {
      throw new BadRequestException('Unable to register user Information');
    }
    return { result };
  }
  async profile(user: Partial<User> & { sub: string }): Promise<any> {
    const userDetails = await this.userModel.findById(user.sub);
    const userInfo = await this.userInfoModel.findOne({ user_id: user.sub });
    const availableSeats = await this.availableSeats();
    return { userDetails, userInfo, availableSeats };
  }

  async getUser(id: string): Promise<any> {
    const userDetails = await this.userModel.findById(new Types.ObjectId(id));
    const userInfo = await this.userInfoModel.findOne({
      user_id: new Types.ObjectId(id),
    });
    return { userDetails, userInfo };
  }

  async getUserByEmail(email: string): Promise<any> {
    const userDetails = await this.userModel.findOne({ email: email });
    return { userDetails };
  }

  async inviteUser(inviteUserDTO: InviteUserDTO): Promise<InvitedUserDocument> {
    const loggedInUser = await this.getLoggedInUserDetails();
    // Plan validation logic
    // const allInvitedByUser = await this.invitedUserModel.findOne({
    //   invited_by: loggedInUser._id,

    // });
    const allAcceptedInvitationByUser = await this.getAcceptedInvitedUser();

    if (allAcceptedInvitationByUser) {
      const totalAccepted = allAcceptedInvitationByUser.length;

      await this.userPlanValidation(loggedInUser._id, totalAccepted);
    }
    // Validate if emails are already invited
    const roles = await Promise.all(
      inviteUserDTO.users.map(({ role }) =>
        this.roleDocumentModel.findOne({ role_name: role }).exec(),
      ),
    );

    // Check for duplicate emails in the input
    const emailSet = new Set();
    const duplicateInputEmails = inviteUserDTO.users.filter((user) => {
      if (emailSet.has(user.email)) {
        return true;
      }
      emailSet.add(user.email);
      return false;
    });

    if (duplicateInputEmails.length > 0) {
      throw new BadRequestException(
        `These emails are duplicated in the input: ${duplicateInputEmails.map((e) => e.email).join(', ')}`,
      );
    }

    const emailToRoleMap = new Map<string, any>(
      inviteUserDTO.users.map(({ email, role }, index) => [
        email,
        roles[index],
      ]),
    );

    // Check for invalid roles
    const invalidRoles = inviteUserDTO.users.filter(
      ({ role }, index) => !roles[index],
    );
    if (invalidRoles.length > 0) {
      throw new BadRequestException(
        `These roles are invalid: ${invalidRoles.map((e) => e.role).join(', ')}`,
      );
    }

    // Check if any of the emails match the logged-in user's email
    const selfInvite = inviteUserDTO.users.find(
      (user) => user.email === loggedInUser.email,
    );
    if (selfInvite) {
      throw new BadRequestException(
        `Cannot invite yourself: ${loggedInUser.email}`,
      );
    }

    const alreadyInvitedEmails = await this.invitedUserModel.find(
      {
        'users.email': { $in: inviteUserDTO.users.map((e) => e.email) },
        'users.status': { $in: [UserStatus.PENDING, UserStatus.ACCEPTED] },
      },
      'users.email users.status',
    );

    const existingEmails = alreadyInvitedEmails.flatMap((doc) =>
      doc.users
        .filter((user) =>
          [
            UserStatus.PENDING.toString(),
            UserStatus.ACCEPTED.toString(),
          ].includes(user.status),
        )
        .map((emailObj) => emailObj.email),
    );
    const duplicatedEmails = inviteUserDTO.users.filter((e) =>
      existingEmails.includes(e.email),
    );
    if (duplicatedEmails.length > 0) {
      throw new BadRequestException(
        `These emails are already invited: ${duplicatedEmails.map((e) => e.email).join(', ')}`,
      );
    }

    // Map the invited users with the fetched role data
    const invitedUsers = inviteUserDTO.users.map(({ email, role }, index) => {
      const roleData = roles[index];
      return {
        email,
        role: roleData ? roleData.toObject() : null,
        status: UserStatus.PENDING,
      };
    });

    // Create or update invited users
    let invitedUser = await this.invitedUserModel.findOne({
      invited_by: loggedInUser._id,
    });

    if (!invitedUser || invitedUser === null) {
      invitedUser = await this.invitedUserModel.create({
        users: invitedUsers,
        invited_by: loggedInUser._id,
      });
    } else {
      await this.invitedUserModel.updateMany(
        {
          invited_by: loggedInUser._id,
          'users.email': { $in: inviteUserDTO.users.map((e) => e.email) },
          'users.status': UserStatus.CANCELLED,
        },
        { $set: { 'users.$[elem].status': UserStatus.PENDING } },
        {
          arrayFilters: [
            { 'elem.email': { $in: inviteUserDTO.users.map((e) => e.email) } },
          ],
        },
      );

      // Add or update invited users
      inviteUserDTO.users.forEach((newUser) => {
        const existingUserIndex = invitedUser.users.findIndex(
          (user) => user.email === newUser.email,
        );
        if (existingUserIndex !== -1) {
          // Update status if user already exists
          invitedUser.users[existingUserIndex].status = UserStatus.PENDING;
        } else {
          // Add new user if they don't already exist
          invitedUser.users.push({
            email: newUser.email,
            role: emailToRoleMap.get(newUser.email)
              ? emailToRoleMap.get(newUser.email).toObject()
              : null,
            status: UserStatus.PENDING,
            user_id: null,
            invited_at: new Date(),
          });
        }
      });

      invitedUser = await invitedUser.save();
    }

    for (const { email, role } of inviteUserDTO.users) {
      const payload = { email: email };
      const accessToken = await this.authRepository.generateJWT(
        payload,
        this.configService.get<string>('JWT_EXPIRATION'),
      );
      console.log('tete', role);
      await this.emailService.inviteUser(email, accessToken, role);
    }

    return invitedUser;
  }

  async userPlanValidation(id: string, totalInvited: number) {
    const getPlan = await this.stripeEventModel.findOne({ user_id: id });
    if (getPlan) {
      if (
        getPlan.subscriptionPlan === PlanSubscription.ESSENTIAL_PLAN &&
        totalInvited === 2
      ) {
        throw new BadRequestException(
          'The maximum number of users allowed by the subscription plan(2) has been reached. Please contact the account owner to upgrade.',
        );
      }
      if (
        getPlan.subscriptionPlan === PlanSubscription.PROFESSIONAL_PLAN &&
        totalInvited === 5
      ) {
        throw new BadRequestException(
          'The maximum number of users allowed by the subscription plan(5) has been reached. Please contact the account owner to upgrade.',
        );
      }
      if (getPlan.subscriptionPlan === PlanSubscription.CORPORATE_PLAN) {
      }
    } else {
      throw new BadRequestException(
        'No active subscription plan found. Please subscribe to a plan.',
      );
    }
  }

  async getInvitedUser(): Promise<any> {
    const user = await this.getLoggedInUserDetails();
    const invitedUser = await this.invitedUserModel.findOne({
      invited_by: user._id,
    });
    return invitedUser;
  }
  async getAcceptedInvitedUserForUserRegistrationValidation(
    email: string,
  ): Promise<any> {
    // const user = await this.getLoggedInUserDetails();
    const invitedUser = await this.invitedUserModel
      .findOne({
        'users.email': email,
      })
      .exec();
    if (invitedUser) {
      const acceptedUsers = invitedUser.users.filter(
        (user) => user.status === 'Accepted',
      );
      return acceptedUsers;
    }

    return [];
  }
  async OrganizationInviteUser(
    inviteUserDTO: OrganizationDTO,
  ): Promise<InvitedUserDocument> {
    const loggedInUser = await this.getLoggedInUserDetails();
    // Validate if emails are already invited
    const roles = await Promise.all(
      inviteUserDTO.users.map(({ role }) =>
        this.roleDocumentModel.findOne({ role_name: role }).exec(),
      ),
    );

    // Check for duplicate emails in the input
    const emailSet = new Set();
    const duplicateInputEmails = inviteUserDTO.users.filter((user) => {
      if (emailSet.has(user.email)) {
        return true;
      }
      emailSet.add(user.email);
      return false;
    });

    if (duplicateInputEmails.length > 0) {
      throw new BadRequestException(
        `These emails are duplicated in the input: ${duplicateInputEmails.map((e) => e.email).join(', ')}`,
      );
    }

    const emailToRoleMap = new Map<string, any>(
      inviteUserDTO.users.map(({ email, role }, index) => [
        email,
        roles[index],
      ]),
    );

    // Check for invalid roles
    const invalidRoles = inviteUserDTO.users.filter(
      ({ role }, index) => !roles[index],
    );
    if (invalidRoles.length > 0) {
      throw new BadRequestException(
        `These roles are invalid: ${invalidRoles.map((e) => e.role).join(', ')}`,
      );
    }

    // Check if any of the emails match the logged-in user's email
    const selfInvite = inviteUserDTO.users.find(
      (user) => user.email === loggedInUser.email,
    );
    if (selfInvite) {
      throw new BadRequestException(
        `Cannot invite yourself: ${loggedInUser.email}`,
      );
    }

    const alreadyInvitedEmails = await this.invitedUserModel.find(
      {
        'users.email': { $in: inviteUserDTO.users.map((e) => e.email) },
        'users.status': { $in: [UserStatus.PENDING, UserStatus.ACCEPTED] },
      },
      'users.email users.status',
    );

    const existingEmails = alreadyInvitedEmails.flatMap((doc) =>
      doc.users
        .filter((user) =>
          [
            UserStatus.PENDING.toString(),
            UserStatus.ACCEPTED.toString(),
          ].includes(user.status),
        )
        .map((emailObj) => emailObj.email),
    );
    const duplicatedEmails = inviteUserDTO.users.filter((e) =>
      existingEmails.includes(e.email),
    );
    if (duplicatedEmails.length > 0) {
      throw new BadRequestException(
        `These emails are already invited: ${duplicatedEmails.map((e) => e.email).join(', ')}`,
      );
    }

    // Map the invited users with the fetched role data
    const invitedUsers = inviteUserDTO.users.map(({ email, role }, index) => {
      const roleData = roles[index];
      return {
        email,
        role: roleData ? roleData.toObject() : null,
        status: UserStatus.PENDING,
      };
    });

    // Create or update invited users
    let invitedUser = await this.invitedUserModel.findOne({
      invited_by: loggedInUser._id,
    });

    if (!invitedUser || invitedUser === null) {
      invitedUser = await this.invitedUserModel.create({
        users: invitedUsers,
        invited_by: loggedInUser._id,
      });
    } else {
      await this.invitedUserModel.updateMany(
        {
          invited_by: loggedInUser._id,
          'users.email': { $in: inviteUserDTO.users.map((e) => e.email) },
          'users.status': UserStatus.CANCELLED,
        },
        { $set: { 'users.$[elem].status': UserStatus.PENDING } },
        {
          arrayFilters: [
            { 'elem.email': { $in: inviteUserDTO.users.map((e) => e.email) } },
          ],
        },
      );

      // Add or update invited users
      inviteUserDTO.users.forEach((newUser) => {
        const existingUserIndex = invitedUser.users.findIndex(
          (user) => user.email === newUser.email,
        );
        if (existingUserIndex !== -1) {
          // Update status if user already exists
          invitedUser.users[existingUserIndex].status = UserStatus.PENDING;
        } else {
          // Add new user if they don't already exist
          invitedUser.users.push({
            email: newUser.email,
            role: emailToRoleMap.get(newUser.email)
              ? emailToRoleMap.get(newUser.email).toObject()
              : null,
            status: UserStatus.PENDING,
            user_id: null,
            invited_at: new Date(),
          });
        }
      });

      invitedUser = await invitedUser.save();
    }

    for (const { email, role } of inviteUserDTO.users) {
      const payload = { email: email };
      const accessToken = await this.authRepository.generateJWT(
        payload,
        this.configService.get<string>('JWT_EXPIRATION'),
      );
      await this.emailService.inviteUser(email, accessToken, role);
    }

    return invitedUser;
  }

  async getAcceptedInvitedUser(): Promise<any> {
    const user = await this.getLoggedInUserDetails();
    const invitedUser = await this.invitedUserModel
      .findOne({
        users: user._id,
      })
      .exec();
    if (invitedUser) {
      const acceptedUsers = invitedUser.users.filter(
        (user) => user.status === 'Accepted',
      );
      return acceptedUsers;
    }

    return [];
  }

  async validateInviteUser(inviteUserDTO: InviteUserDTO): Promise<any> {
    const loggedInUser = this.request.user as User; // Assuming User type for logged-in user
    const userData = await this.userModel.findOne({
      email: loggedInUser.email,
    });

    if (userData && userData.already_send_invites) {
      throw new BadRequestException('You have already sent invites.');
    }

    const invitedEmails = inviteUserDTO.users.map((item) => item.email);
    const alreadyInvitedUsers = await this.invitedUserModel.find(
      {
        'users.email': { $in: invitedEmails },
      },
      'users.email',
    );

    const matchedEmails = alreadyInvitedUsers.flatMap((doc) =>
      doc.users.map((emailObj) => emailObj.email),
    );

    const alreadyInvited = invitedEmails.filter((email) =>
      matchedEmails.includes(email),
    );

    if (alreadyInvited.length > 0) {
      throw new BadRequestException(
        `These emails are already invited: ${alreadyInvited.join(', ')}.`,
      );
    }

    const emails = inviteUserDTO.users.map(({ email, role }) => ({
      email,
      role,
      status: UserStatus.PENDING,
    }));

    return emails;
  }
  async updateUserStripeId(stripeId: string, userId: string): Promise<any> {
    const stripeEvent = await this.stripeEventModel.findOne({
      stripe_event_id: stripeId,
    });
    const stripeSubscription = await this.userInfoModel.findOneAndUpdate(
      { user_id: new Types.ObjectId(userId) },
      {
        $set: {
          stripe_id: stripeEvent._id,
        },
      },
    );
    return stripeSubscription;
  }

  async updateWeatherInfoId(
    weatherforecast_id: string,
    userId: string,
  ): Promise<any> {
    const weatherforecast = await this.weatherforecastModel.findOne({
      _id: weatherforecast_id,
    });
    const userWeatherforecast = await this.userInfoModel.findOneAndUpdate(
      { user_id: new Types.ObjectId(userId) },
      {
        $set: {
          weatherforecast_id: weatherforecast._id,
        },
      },
    );
    return userWeatherforecast;
  }

  async availableSeats(): Promise<any> {
    const loggedInUser = await this.getLoggedInUserDetails();
    const allAcceptedInvitationByUser = await this.getAcceptedInvitedUser();
    const totalAccepted = allAcceptedInvitationByUser.length;

    const getPlan = await this.stripeEventModel.findOne({
      user_id: loggedInUser._id,
    });
    if (getPlan) {
      if (getPlan.subscriptionPlan === PlanSubscription.ESSENTIAL_PLAN) {
        return {
          max_seats: 2,
          occupied_seats: totalAccepted,
          subscription_plan: PlanSubscription.ESSENTIAL_PLAN,
        };
      }
      if (getPlan.subscriptionPlan === PlanSubscription.PROFESSIONAL_PLAN) {
        return {
          max_seats: 5,
          occupied_seats: totalAccepted,
          subscription_plan: PlanSubscription.PROFESSIONAL_PLAN,
        };
      }
      if (getPlan.subscriptionPlan === PlanSubscription.CORPORATE_PLAN) {
        return {
          max_seats: 'unlimited',
          occupied_seats: totalAccepted,
          subscription_plan: PlanSubscription.CORPORATE_PLAN,
        };
      }
    } else {
      return {
        message:
          'No active subscription plan found. Please subscribe to a plan.',
      };
    }
  }
  async invitedUserRegistration(
    invitedUserRegistrationDTO: InvitedUserRegistrationDTO,
    token: string,
  ): Promise<any> {
    const user = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    const isInvited = await this.invitedUserModel.findOne({
      'users.email': user.email,
    });
    // Check if the user is invited
    if (!isInvited) {
      throw new BadRequestException('Unable to Register, User is not Invited');
    }
    console.log('email logs', invitedUserRegistrationDTO.email);
    if (user.email !== invitedUserRegistrationDTO.email) {
      throw new BadRequestException(
        'Unable to Register, Inputted email is not matched to the decoded token',
      );
    }
    console.log('1');
    const allAcceptedInvitationByUser =
      await this.getAcceptedInvitedUserForUserRegistrationValidation(
        invitedUserRegistrationDTO.email,
      );
    console.log('2');

    if (allAcceptedInvitationByUser) {
      const totalAccepted = allAcceptedInvitationByUser.length;
      console.log('3');

      await this.userPlanValidation(
        isInvited.invited_by.toString(),
        totalAccepted,
      );
    }
    console.log('4');

    // Find the specific email entry within the emails array
    const emailEntry = isInvited.users.find(
      (email) => email.email === user.email,
    );
    console.log('5');

    let role: any;
    if (emailEntry && emailEntry.role) {
      console.log('6');

      role = await this.roleDocumentModel.findOne({
        _id: emailEntry.role,
      });
      console.log('7');

      if (!role) {
        throw new BadRequestException('Role does not exist!');
      }
    } else {
      throw new BadRequestException('Role not found for the given email.');
    }
    console.log('8');

    // Confirm passwords match
    const isverified = await this.otpModel.findOne({
      email: user.email,
    });
    console.log('9');

    if (!isverified || isverified.verified_email != true) {
      throw new BadRequestException('Email is not yet Verified');
    }
    console.log('a');

    //   throw new BadRequestException('Password Does Not Match');
    const isExisting = await this.userModel.findOne({ email: user.email });
    //check email if existing
    if (isExisting) {
      throw new BadRequestException('User is already Existing');
    }
    console.log('b');

    const newUser = await this.userModel.create({
      email: user.email,
      role: role,
      password: invitedUserRegistrationDTO.password,
      login_by: SignInBy.SIGN_IN_BY_SERVICE_HERO,
    });
    console.log('c');

    if (!newUser) throw new BadRequestException('error registration user');
    const userInvited = await this.invitedUserModel.findOneAndUpdate(
      { 'users.email': user.email },
      //update status for specific email that matches to invited user
      {
        $set: {
          'users.$.status': UserStatus.ACCEPTED,
          'users.$.user_id': newUser._id,
        },
      },
      { new: true },
    );
    console.log('d');

    const invitedUserData = userInvited.users.find(
      (data: any) => data.email === user.email,
    );
    console.log('e');

    const updateTeam = await this.teamModel.findOneAndUpdate(
      { _id: invitedUserData.team },
      {
        $push: {
          team_members: newUser._id,
        },
      },
    );
    console.log('f');

    return { newUser };
  }

  async sendOTP(email: string): Promise<any> {
    const validateEmail = await this.userModel.findOne({ email: email });
    if (validateEmail) {
      throw new BadRequestException('Email is already Registered');
    }
    await this.otpModel.deleteOne({
      email: email,
    });
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Set OTP expiration time (10 minutes)

    // Save OTP to the database
    const otpEntry = new this.otpModel({ email, otp, expiresAt });
    await otpEntry.save();

    // Send OTP via email
    await this.emailService.sendOTP(email, otp);
  }

  async verifyOTP(email: string, otp: string): Promise<any> {
    const otpEntry = await this.otpModel.findOneAndUpdate(
      { email, otp },
      {
        verified_email: true,
      },
    );

    if (!otpEntry) {
      throw new BadRequestException('Invalid OTP or email.');
    }

    const now = new Date();
    if (otpEntry.expiresAt < now) {
      await this.otpModel.deleteOne({ _id: otpEntry._id }); // Remove expired OTP
      throw new BadRequestException('OTP has expired.');
    }
    return { message: 'OTP verified successfully' };
  }

  async cancelInviteUser(email: string): Promise<any> {
    const user = await this.getLoggedInUserDetails();
    const invitation = await this.invitedUserModel.findOne({
      'users.email': email,
      invited_by: user._id,
      'users.status': 'Pending',
    });

    if (!invitation) {
      throw new Error('No pending invitation found for this email.');
    }

    const updatedDocument = await this.invitedUserModel.findOneAndUpdate(
      {
        invited_by: user._id,
        users: {
          $elemMatch: {
            email: email,
            status: 'Pending',
          },
        },
      },
      {
        $set: { 'users.$.status': 'Cancelled' },
      },
      { new: true },
    );

    if (!updatedDocument) {
      throw new Error(
        'Failed to cancel the invitation. It may have already been accepted or does not exist.',
      );
    }

    return { message: 'Successfully cancelled the invitation for ${email}.' };
  }

  async uploadProfile(
    files: ProfileImages,
    userInfoId: string,
  ): Promise<any | null> {
    const images: any = {};
    const user = await this.getLoggedInUserDetails();
    if (files === undefined)
      throw new BadRequestException('Image files cannot be empty.');
    console.log('1312');

    if (files) {
      console.log('132131');

      // s3 bucket upload and insertion in fileuploads collection
      const s3 = await this.UploadtoS3Bucket(files, userInfoId);
      console.log('3121');

      for (const image of Object.keys(s3)) {
        images[image] = s3[image];
      }
    }
    console.log('1123');

    const da = await this.userInfoModel.findOneAndUpdate(
      { _id: new Types.ObjectId(userInfoId) },
      { $set: { profile: {} } },
    );
    console.log('113', da);

    await this.invitedUserModel.findOneAndUpdate(
      { 'users.email': user.email },
      { $set: { 'users.$.profile': images } },
      { new: true },
    );
    console.log('1');
    return await this.userInfoModel.findOneAndUpdate(
      { _id: new Types.ObjectId(userInfoId) },
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
    return `${this.host}/api/user/images/${id}/image`;
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
    const findUserInfo = await this.userInfoModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!findUserInfo)
      throw new BadRequestException(`Invalid user information id: ${id}`);

    const { profile } = findUserInfo;

    const image = profile[type];

    if (!image) throw new BadRequestException(`Invalid document image`);

    const filename = image?.filename ?? '';
    console.log('result', this.getDomainHost(id));

    const result = {
      file: this.getDomainHost(id) + '/' + path + '?type=' + type,
      filename,
      mimetype: image?.mimetype ?? '',
      path: `${path}/${filename}`,
    };

    return result;
  }

  async forgotPassword(email: string): Promise<any> {
    const validateEmail = await this.userModel.findOne({ email: email });
    if (!validateEmail) {
      throw new BadRequestException('Email not found in the system');
    }

    const payload = { email: email };
    const access_token = await this.authRepository.generateJWT(
      payload,
      this.configService.get<string>('JWT_EXPIRATION'),
    );
    await this.emailService.forgotPassword(email, access_token);
    await this.userModel.findOneAndUpdate(
      { email: email },
      { $set: { reset_password_token: access_token } },
      { new: true },
    );
    return { message: 'Reset Password Link Sent' };
  }

  async resetPassword(
    token: string,
    resetPasswordDTO: ResetPasswordDto,
  ): Promise<any> {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(resetPasswordDTO.password, 12);
    await this.validateResetPassToken(token);

    const resetPassword = await this.userModel.findOneAndUpdate(
      { reset_password_token: token },
      { $set: { password: hashedPassword, reset_password_token: null } },
      { new: true },
    );
    if (!resetPassword) {
      throw new BadRequestException(
        "Password couldn't be reset. Please try again later.",
      );
    }
    return resetPassword;
  }

  async findUsersByIds(
    userIds: string[],
  ): Promise<{ users: User[]; userInfos: UserInfo[] }> {
    const usersPromise = this.userModel.find({ _id: { $in: userIds } }).exec();
    const userInfosPromise = this.userInfoModel
      .find({ user_id: { $in: userIds } })
      .exec();
    const [users, userInfos] = await Promise.all([
      usersPromise,
      userInfosPromise,
    ]);
    return { users, userInfos };
  }

  async getMember(): Promise<any> {
    const user = await this.getLoggedInUserDetails();
    const invitedUser = await this.invitedUserModel.findOne({
      invited_by: user._id,
    });
    invitedUser.users = invitedUser.users.filter(
      (user) => user.status === UserStatus.ACCEPTED,
    );
    invitedUser.users = invitedUser.users.filter(
      (user) => user.status === UserStatus.ACCEPTED,
    );
    return invitedUser;
  }
}
