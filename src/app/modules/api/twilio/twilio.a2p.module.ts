import { Global, Module } from "@nestjs/common";
import { TwilioA2PController } from "src/app/controller/api/twilio/twilio.a2p.controller";
import { TwilioOrganizations, TwilioOrganizationsSchema } from "src/app/models/messaging-twilio/organization/organization.schema";
import { TwilioA2PSchemaModule } from "src/app/models/twilio/twilio.a2p.schema.module";
import { MessagingTwilioRepository } from "src/app/repository/messaging-twilio/messaging-twilio.repository";
import { TwilioA2PRepository } from "src/app/repository/twilio-a2p/twilio.a2p.repository";
import { UserRepository } from "src/app/repository/user/user.repository";
import { TwilioA2PService } from "src/app/services/api/twilio/twilio.a2p.service";
import { MessagingTwilioModule } from "../../messaging-twilio/messaging-twilio.module";
import { MessagingTwilioSchemaModule } from "src/app/models/messaging-twilio/messaging-twilio.schema.module";
import { UserSchemaModule } from "src/app/models/user/user.schema.module";
import { RoleSchemaModule } from "src/app/models/role/role.schema.module";
import { OtpSchemaModule } from "src/app/models/otp/otp.schema.module";
import { StripeEventSchemaModule } from "src/app/models/stripe/stripe.event.schema.module";
import { WeatherForecastSchemaModule } from "src/app/models/weatherforecast/weatherforecast.schema.module";
import { InvitedUserSchemaModule } from "src/app/models/invited-users/invited-users.schema.module";
import { EmailerService } from "@util/emailer/emailer";
import { AuthRepository } from "src/app/repository/auth/auth.repository";
import { FileUploadSchemaModule } from "src/app/models/file-upload/file-upload.schema.module";
import { TeamSchemaModule } from "src/app/models/settings/manage-team/team/team.schema.module";
import { S3Service } from "src/app/services/s3/s3.service";
import { OauthRepository } from "src/app/repository/oauth/oauth.repository";
import { MailerService, MailerModule, MAILER_OPTIONS } from '@nestjs-modules/mailer';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from "src/app/services/user/user.service";
import { AbstractUserRepository, AbstractUserService } from "src/app/interface/user";
import { JwtService } from "@nestjs/jwt";

@Global()
@Module({
    imports: [
        TwilioA2PSchemaModule,
        MessagingTwilioModule,
        MessagingTwilioSchemaModule,
        UserSchemaModule,
        RoleSchemaModule,
        OtpSchemaModule,
        StripeEventSchemaModule,
        WeatherForecastSchemaModule,
        InvitedUserSchemaModule,
        FileUploadSchemaModule,
        TeamSchemaModule
    ],
    controllers: [TwilioA2PController],
    providers: [
        MessagingTwilioRepository,
        UserRepository,
        TwilioA2PRepository,
        TwilioA2PService,
        EmailerService,
        AuthRepository,
        S3Service,
        JwtService,
        UserService,
        OauthRepository,
        {
            provide: AbstractUserRepository,
            useClass: UserRepository,
        },
        {
            provide: AbstractUserService,
            useClass: UserService,
        },
        MailerService,
        {
            provide: MAILER_OPTIONS,
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('SMTP_HOST'),
                    secure: true,
                    auth: {
                        user: configService.get<string>('SMTP_USER'),
                        pass: configService.get<string>('SMTP_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"No Reply" <${configService.get<string>('EMAIL_NO_REPLY_ADDRESS')}>`,
                },
            }),
            inject: [ConfigService],
        }
    ],

    exports: [
    ],
})
export class TwilioA2PModule { }