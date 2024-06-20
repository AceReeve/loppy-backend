import { Module } from '@nestjs/common';
import { ModelModule } from '../models/model.module';
import { UserRepository } from './user/user.repository';
import { AbstractUserRepository } from 'src/app/interface/user';
import { AuthRepository } from 'src/app/repository/auth/auth.repository';
import { EmailerModule } from '@util/emailer/emailer';
import { JwtService } from '@nestjs/jwt';
import { OauthRepository } from './oauth/oauth.repository';
import { StripeEventSchemaModule } from '../models/stripe/stripe.event.schema.module';
import { WeatherForecastSchemaModule } from '../models/weatherforecast/weatherforecast.schema.module';
import { FileUploadSchemaModule } from '../models/file-upload/file-upload.schema.module';
import { S3Service } from '../services/s3/s3.service';

@Module({
  imports: [
    ModelModule,
    EmailerModule,
    StripeEventSchemaModule,
    WeatherForecastSchemaModule,
    FileUploadSchemaModule,
  ],
  controllers: [],
  // Inversion
  providers: [
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    },
    AuthRepository,
    JwtService,
    OauthRepository,
    S3Service,
  ],

  exports: [
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    },
    ModelModule,
    // UserRepository,
    AuthRepository,
  ],
})
export class RepositoryModule {}
