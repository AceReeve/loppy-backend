import {
  BadRequestException,
  Injectable,
  Inject,
  StreamableFile,
  InternalServerErrorException,
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
    private readonly s3: S3Service,
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
    const newUser = await this.userModel.create({
      email: userRegisterDto.email,
      password: userRegisterDto.password,
      verified_email: true,
      login_by: SignInBy.SIGN_IN_BY_SERVICE_HERO,
      login_count: 1,
    });

    if (!newUser) throw new BadRequestException('Unable to register user');

    return { newUser };
  }
  async createUserInfo(userInfoDTODto: UserInfoDTO): Promise<any> {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    //set default role
    const role = await this.roleDocumentModel.findOne({
      role_name: DefaultUserRole.ADMIN,
    });
    const userInfoDTO = {
      ...userInfoDTODto,
      user_id: userData._id,
      role: role._id,
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
      { 'emails.email': user.email },
      //update status for specific email that matches to invited user
      {
        $set: {
          'emails.$.first_name': userInfoDTO.first_name,
          'emails.$.last_name': userInfoDTO.last_name,
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
    return { userDetails, userInfo };
  }

  async getUser(id: string): Promise<any> {
    const userDetails = await this.userModel.findById(new Types.ObjectId(id));
    const userInfo = await this.userInfoModel.findOne({
      user_id: new Types.ObjectId(id),
    });
    return { userDetails, userInfo };
  }

  // async inviteUser(inviteUserDTO: InviteUserDTO): Promise<any> {
  //   const user = this.request.user as Partial<User> & { sub: string };
  //   const userData = await this.userModel.findOne({ email: user.email });
  //   const isInvitedAlready = await this.invitedUserModel.find(
  //     { 'emails.email': { $in: inviteUserDTO.email } },
  //     'emails.email',
  //   );
  //   // Extract all emails from the matched documents
  //   let matchedEmails = isInvitedAlready.flatMap((doc) =>
  //     doc.emails.map((emailObj) => emailObj.email),
  //   );
  //   // Filter out only those that were in the DTO's email list
  //   matchedEmails = matchedEmails.filter((email) =>
  //     inviteUserDTO.email.includes(email.),
  //   );

  //   if (matchedEmails.length > 0) {
  //     //print the emails that already invited
  //     throw new BadRequestException(
  //       `These emails are already invited: ${matchedEmails.join(', ')}.`,
  //     );
  //   }
  //   //plan validation

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

  //     await this.userPlanValidation(userData._id, totalInvitedEmails);
  //   }
  //   //
  //   for (const email of inviteUserDTO.email) {
  //     const payload = { email: email };
  //     const access_token = await this.authRepository.generateJWT(
  //       payload,
  //       this.configService.get<string>('JWT_EXPIRATION'),
  //     );
  //     await this.emailService.inviteUser(email, access_token);
  //   }

  //   const emails = inviteUserDTO.email.map((emailAddress) => ({
  //     email: emailAddress,
  //     status: UserStatus.PENDING,
  //     date: new Date(),
  //   }));
  //   const existingInvitedUser = await this.invitedUserModel.findOne({
  //     invited_by: userData._id,
  //   });
  //   let result: any;
  //   if (!existingInvitedUser) {
  //     result = await this.invitedUserModel.create({
  //       emails: emails,
  //       invited_by: userData._id,
  //     });
  //   } else {
  //     const updatedEmails = existingInvitedUser.emails.concat(emails);
  //     existingInvitedUser.emails = updatedEmails;
  //     result = await existingInvitedUser.save();
  //   }

  //   const updateUser = await this.userModel.findOneAndUpdate(
  //     { _id: userData._id },
  //     {
  //       already_send_invites: true,
  //     },
  //   );
  //   return result;
  // }

  async inviteUser(inviteUserDTO: InviteUserDTO): Promise<InvitedUserDocument> {
    const loggedInUser = await this.getLoggedInUserDetails();
    // Validate if emails are already invited
    const roles = await Promise.all(
      inviteUserDTO.users.map(({ role }) => this.roleDocumentModel.findOne({role_name: role}).exec())
    );

    const alreadyInvitedEmails = await this.invitedUserModel.find(
      {
        'emails.email': { $in: inviteUserDTO.users.map((e) => e.email) },
      },
      'emails.email',
    );

    const existingEmails = alreadyInvitedEmails.flatMap((doc) =>
      doc.users.map((e) => e.email),
    );

    const duplicatedEmails = inviteUserDTO.users.filter((e) =>
      existingEmails.includes(e.email),
    );

    if (duplicatedEmails.length > 0) {
      throw new BadRequestException(
        `These emails are already invited: ${duplicatedEmails.map((e) => e.email).join(', ')}`,
      );
    }

    // Prepare invited users data
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
      invitedUser.users.push(...invitedUsers);
      invitedUser = await invitedUser.save();
    }

    for (const { email } of inviteUserDTO.users) {
      const payload = { email: email };
      const accessToken = await this.authRepository.generateJWT(
        payload,
        this.configService.get<string>('JWT_EXPIRATION'),
      );
      await this.emailService.inviteUser(email, accessToken);
    }

    return invitedUser;
  }

  async userPlanValidation(id: string, totalInvited: number) {
    const getPlan = await this.stripeEventModel.findOne({ user_id: id });
    if (
      getPlan.subscriptionPlan === PlanSubscription.ESSENTIAL_PLAN &&
      totalInvited === 2
    ) {
      throw new BadRequestException(
        'You have reached the maximum number of users allowed by your subscription(2). Please upgrade your plan.',
      );
    }
    if (
      getPlan.subscriptionPlan === PlanSubscription.PROFESSIONAL_PLAN &&
      totalInvited === 5
    ) {
      throw new BadRequestException(
        'You have reached the maximum number of users allowed by your subscription(5). Please upgrade your plan.',
      );
    }
    if (getPlan.subscriptionPlan === PlanSubscription.CORPORATE_PLAN) {
    }
  }

  async getInvitedUser(): Promise<any> {
    const user = await this.getLoggedInUserDetails();
    const invitedUser = await this.invitedUserModel.findOne({
      invited_by: user._id,
    });
    return invitedUser;
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
        'emails.email': { $in: invitedEmails },
      },
      'emails.email',
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

  async invitedUserRegistration(
    invitedUserRegistrationDTO: InvitedUserRegistrationDTO,
  ): Promise<any> {
    const user = this.request.user as Partial<User>;

    const isInvited = await this.invitedUserModel.findOne({
      'emails.email': user.email,
    });
    // Check if the user is invited
    if (!isInvited) {
      throw new BadRequestException('Unable to Register, User is not Invited');
    }

    // Find the specific email entry within the emails array
    const emailEntry = isInvited.users.find(
      (email) => email.email === user.email,
    );
    let role: any;
    if (emailEntry && emailEntry.role) {
      role = await this.roleDocumentModel.findOne({
        _id: emailEntry.role,
      });

      if (!role) {
        throw new BadRequestException('Role does not exist!');
      }
    } else {
      throw new BadRequestException('Role not found for the given email.');
    }

    // Confirm passwords match
    const isverified = await this.otpModel.findOne({
      email: user.email,
    });
    if (!isverified || isverified.verified_email != true) {
      throw new BadRequestException('Email is not yet Verified');
    }

    //   throw new BadRequestException('Password Does Not Match');
    const isExisting = await this.userModel.findOne({ email: user.email });
    //check email if existing
    if (isExisting) {
      throw new BadRequestException('User is already Existing');
    }
    const newUser = await this.userModel.create({
      email: user.email,
      role: role._id,
      password: invitedUserRegistrationDTO.password,
    });
    if (!newUser) throw new BadRequestException('error registration user');
    await this.invitedUserModel.findOneAndUpdate(
      { 'emails.email': user.email },
      //update status for specific email that matches to invited user
      { $set: { 'emails.$.status': UserStatus.ACCEPTED } },
      { new: true },
    );
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
    const updatedDocument = await this.invitedUserModel.findOneAndUpdate(
      { 'emails.email': email, invited_by: user._id },
      { $set: { 'emails.$.status': UserStatus.CANCELLED } },
      { new: true },
    );
    if (!updatedDocument) {
      throw new Error('Email not found in invitations.');
    }
    return `Successfully cancelled the invitation for ${email}.`;
  }

  async uploadProfile(
    files: ProfileImages,
    userInfoId: string,
  ): Promise<any | null> {
    const images: any = {};
    const user = await this.getLoggedInUserDetails();
    if (files === undefined)
      throw new BadRequestException('Image files cannot be empty.');

    if (files) {
      // s3 bucket upload and insertion in fileuploads collection
      const s3 = await this.UploadtoS3Bucket(files, userInfoId);

      for (const image of Object.keys(s3)) {
        images[image] = s3[image];
      }
    }

    await this.userInfoModel.findOneAndUpdate(
      { _id: userInfoId },
      { $set: { profile: {} } },
    );

    await this.invitedUserModel.findOneAndUpdate(
      { 'emails.email': user.email },
      { $set: { 'emails.$.profile': images } },
      { new: true },
    );

    return await this.userInfoModel.findOneAndUpdate(
      { _id: userInfoId },
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
    }

    return uploadedFiles;
  }

  private host =
    this.configService.get<string>('HOST') ||
    ('http://localhost:8080' as string);
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
}
