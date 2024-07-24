import { Module } from '@nestjs/common';
import { AbstractUserService } from 'src/app/interface/user';
import { AbstractUserRepository } from 'src/app/interface/user';
import { UserController } from 'src/app/controller/user/user.controller';
import { UserRepository } from 'src/app/repository/user/user.repository';
import { UserService } from 'src/app/services/user/user.service';
import { UserSchemaModule } from 'src/app/models/user/user.schema.module';
import { RoleSchemaModule } from 'src/app/models/role/role.schema.module';
import { JwtService } from '@nestjs/jwt';
import { EmailerModule } from '@util/emailer/emailer';
import { StripeEventSchemaModule } from 'src/app/models/stripe/stripe.event.schema.module';
import { InvitedUserSchemaModule } from 'src/app/models/invited-users/invited-users.schema.module';
import { AuthRepository } from 'src/app/repository/auth/auth.repository';
import { OauthRepository } from 'src/app/repository/oauth/oauth.repository';
import { WeatherForecastSchema } from 'src/app/models/weatherforecast/weatherforecast.schema';
import { WeatherForecastSchemaModule } from 'src/app/models/weatherforecast/weatherforecast.schema.module';
import { OtpSchemaModule } from 'src/app/models/otp/otp.schema.module';
import { FileUploadSchemaModule } from 'src/app/models/file-upload/file-upload.schema.module';
import { S3Service } from 'src/app/services/s3/s3.service';
import { ManageTeamController } from 'src/app/controller/settings/manage-team/manage-team.controller';
import {
  AbstractManageTeamRepository,
  AbstractManageTeamService,
} from 'src/app/interface/settings/manage-team';
import { ManageTeamRepository } from 'src/app/repository/settings/manage-team/manage-team.repository';
import { ManageTeamService } from 'src/app/services/settings/manage-team/manage-team.service';
import { InvitedMemberSchemaModule } from 'src/app/models/settings/manage-team/invite-member/manage-team.schema.module';
import { TeamSchemaModule } from 'src/app/models/settings/manage-team/team/team.schema.module';
import { CustomeRoleSchemaModule } from 'src/app/models/settings/manage-team/custom-role/custom-role.schema.module';

@Module({
  imports: [
    UserSchemaModule,
    RoleSchemaModule,
    EmailerModule,
    StripeEventSchemaModule,
    InvitedMemberSchemaModule,
    OtpSchemaModule,
    WeatherForecastSchemaModule,
    InvitedUserSchemaModule,
    FileUploadSchemaModule,
    TeamSchemaModule,
    CustomeRoleSchemaModule,
  ],
  controllers: [ManageTeamController],
  providers: [
    {
      provide: AbstractManageTeamRepository,
      useClass: ManageTeamRepository,
    },
    {
      provide: AbstractManageTeamService,
      useClass: ManageTeamService,
    },
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    },
    JwtService,
    UserService,
    AuthRepository,
    OauthRepository,
    S3Service,
    UserRepository,
  ],

  exports: [
    // UserSchemaModule,
    {
      provide: AbstractManageTeamRepository,
      useClass: ManageTeamRepository,
    },
    {
      provide: AbstractManageTeamService,
      useClass: ManageTeamService,
    },
  ],
})
export class ManageTeamModule {}
