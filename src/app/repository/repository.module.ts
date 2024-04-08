import { Module } from '@nestjs/common';
import { ModelModule } from '../models/model.module';
import { UserRepository } from './user/user.repository';
import { AbstractUserRepository } from 'src/app/interface/user';
import { AuthRepository } from 'src/app/repository/auth/auth.repository';
import { EmailerModule } from '@util/emailer/emailer';
import { JwtService } from '@nestjs/jwt';
import { StripeEventSchemaModule } from '../models/stripe/stripe.event.schema.module';

@Module({
  imports: [ModelModule, EmailerModule, StripeEventSchemaModule],
  controllers: [],
  // Inversion
  providers: [
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    },
    AuthRepository, JwtService
  ],

  exports: [
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    },
    ModelModule,
    // UserRepository,
    AuthRepository
  ],
})
export class RepositoryModule { }
