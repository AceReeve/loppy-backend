import { Module, Global } from '@nestjs/common';
import { TwilioService } from 'src/app/services/api/twilio/twilio.service';
import { Twilio } from 'twilio';
import { TwilioClient } from 'src/app/const';
import { TwilioController } from 'src/app/controller/api/twilio/twilio.controller';
import { UserSchemaModule } from 'src/app/models/user/user.schema.module'
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/app/services/user/user.service';
import { UserModule } from 'src/app/modules/user/user.module';
import { AbstractUserRepository } from 'src/app/interface/user';
import { UserRepository } from 'src/app/repository/user/user.repository';
import { RoleSchemaModule } from 'src/app/models/role/role.schema.module';


@Global()
@Module({
  imports: [UserSchemaModule, UserModule, RoleSchemaModule],
  providers: [
    {
      provide: TwilioClient.TWILIO_CLIENT,
      useFactory: () => {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        if (!accountSid || !authToken) {
          throw new Error('Twilio account SID and auth token must be provided');
        }
        return new Twilio(accountSid, authToken);
      },
    },
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    },
    UserService, TwilioService, JwtService,
  ],
  controllers: [TwilioController],
  exports: [TwilioService],
})
export class TwilioModule { }
