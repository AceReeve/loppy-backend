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
} from 'src/app/dto/user';
import * as _ from 'lodash';
import { SignInBy } from 'src/app/const';
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
      role_name: UserRole.OWNER,
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

  async inviteUser(inviteUserDTO: InviteUserDTO): Promise<any> {
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    const isInvitedAlready = await this.invitedUserModel.find(
      { 'emails.email': { $in: inviteUserDTO.email } },
      'emails.email',
    );
    // Extract all emails from the matched documents
    let matchedEmails = isInvitedAlready.flatMap((doc) =>
      doc.emails.map((emailObj) => emailObj.email),
    );
    // Filter out only those that were in the DTO's email list
    matchedEmails = matchedEmails.filter((email) =>
      inviteUserDTO.email.includes(email),
    );

    if (matchedEmails.length > 0) {
      //print the emails that already invited
      throw new BadRequestException(
        `These emails are already invited: ${matchedEmails.join(', ')}.`,
      );
    }
    //plan validation

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

      await this.userPlanValidation(userData._id, totalInvitedEmails);
    }
    //
    for (const email of inviteUserDTO.email) {
      const payload = { email: email };
      const access_token = await this.authRepository.generateJWT(
        payload,
        this.configService.get<string>('JWT_EXPIRATION'),
      );
      await this.emailService.inviteUser(email, access_token);
    }

    const emails = inviteUserDTO.email.map((emailAddress) => ({
      email: emailAddress,
      status: UserStatus.PENDING,
      date: new Date(),
    }));
    const existingInvitedUser = await this.invitedUserModel.findOne({
      invited_by: userData._id,
    });
    let result: any;
    if (!existingInvitedUser) {
      result = await this.invitedUserModel.create({
        emails: emails,
        invited_by: userData._id,
      });
    } else {
      const updatedEmails = existingInvitedUser.emails.concat(emails);
      existingInvitedUser.emails = updatedEmails;
      result = await existingInvitedUser.save();
    }

    const updateUser = await this.userModel.findOneAndUpdate(
      { _id: userData._id },
      {
        already_send_invites: true,
      },
    );
    return result;
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
    const user = this.request.user as Partial<User> & { sub: string };
    const userData = await this.userModel.findOne({ email: user.email });
    const isInvitedAlready = await this.invitedUserModel.find(
      { 'emails.email': { $in: inviteUserDTO.email } },
      'emails.email',
    );
    if (userData.already_send_invites === true) {
      //validate if already send invites
      throw new BadRequestException(`you already send invites`);
    }
    // Extract all emails from the matched documents
    let matchedEmails = isInvitedAlready.flatMap((doc) =>
      doc.emails.map((emailObj) => emailObj.email),
    );
    // Filter out only those that were in the DTO's email list
    matchedEmails = matchedEmails.filter((email) =>
      inviteUserDTO.email.includes(email),
    );

    if (matchedEmails.length > 0) {
      //print the emails that already invited
      throw new BadRequestException(
        `These emails are already invited: ${matchedEmails.join(', ')}.`,
      );
    }
    const emails = inviteUserDTO.email.map((emailAddress) => ({
      email: emailAddress,
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
    const role = await this.roleDocumentModel.findOne({
      role_name: UserRole.User,
    });
    if (!role) throw new BadRequestException('Role does not exist!');
    const isInvited = await this.invitedUserModel.findOne({
      'emails.email': user.email,
    });
    // Check if the user is invited
    if (!isInvited) {
      throw new BadRequestException('Unable to Register, User is not Invited');
    }
    // Confirm passwords match
    const isverified = await this.otpModel.findOne({
      email: user.email,
    });
    if (!isverified || isverified.verified_email != true) {
      throw new BadRequestException('Email is not yet Verified');
    }

    // if (
    //   invitedUserRegistrationDTO.password !=
    //   invitedUserRegistrationDTO.confirm_password
    // )
    //   throw new BadRequestException('Password Does Not Match');
    const isExisting = await this.userModel.findOne({ email: user.email });
    //check email if existing
    if (isExisting) {
      throw new BadRequestException('User is already Existing');
    }
    const newUser = await this.userModel.create({
      email: user.email,
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
}
