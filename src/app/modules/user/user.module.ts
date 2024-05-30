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
import { StripeModule } from '../api/api.module';
import { InvitedUserSchemaModule } from 'src/app/models/invited-users/invited-users.schema.module';
import { AuthRepository } from 'src/app/repository/auth/auth.repository';
import { OauthRepository } from 'src/app/repository/oauth/oauth.repository';
import { WeatherForecastSchema } from 'src/app/models/weatherforecast/weatherforecast.schema';
import { WeatherForecastSchemaModule } from 'src/app/models/weatherforecast/weatherforecast.schema.module';

@Module({
  imports: [
    UserSchemaModule,
    RoleSchemaModule,
    EmailerModule,
    StripeEventSchemaModule,
    WeatherForecastSchemaModule,
    InvitedUserSchemaModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    },
    {
      provide: AbstractUserService,
      useClass: UserService,
    },
    JwtService,
    UserService,
    AuthRepository,
    OauthRepository,
  ],

  exports: [
    UserSchemaModule,
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    },
    {
      provide: AbstractUserService,
      useClass: UserService,
    },
  ],
})
export class UserModule { }
