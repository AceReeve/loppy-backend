import { Module, Global } from '@nestjs/common';
import { StripeService } from 'src/app/services/api/stripe/stripe.service';
import { StripeController } from 'src/app/controller/api/stripe/stripe.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeWebhookService } from 'src/app/services/api/stripe/stripe.webhook.service';
import { UserService } from 'src/app/services/user/user.service';
import { StripeEventRepository } from 'src/app/repository/stripe/stripe.event.repository';
import { AbstractUserRepository } from 'src/app/interface/user';
import { UserRepository } from 'src/app/repository/user/user.repository';
import { UserModule } from '../user/user.module';
import { StripeEventSchemaModule } from 'src/app/models/stripe/stripe.event.schema.module';
import { RoleModule } from '../role/role.module';
import { RoleSchemaModule } from 'src/app/models/role/role.schema.module';
import { JwtService } from '@nestjs/jwt';
import { EmailerModule, EmailerService } from '@util/emailer/emailer';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { InvitedUserSchemaModule } from 'src/app/models/invited-users/invited-users.schema.module';
import { AuthRepository } from 'src/app/repository/auth/auth.repository';
import { OauthRepository } from 'src/app/repository/oauth/oauth.repository';
@Module({
  imports: [ConfigModule, StripeModule, UserModule, StripeEventSchemaModule, RoleSchemaModule, MailerModule, EmailerModule, InvitedUserSchemaModule],
  controllers: [StripeController],
  providers: [StripeService, StripeWebhookService, StripeEventRepository, UserService, JwtService, OauthRepository,
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    }, AuthRepository],

  exports: [StripeService, StripeWebhookService, StripeEventRepository,
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    }
  ],
})
export class StripeModule { }
