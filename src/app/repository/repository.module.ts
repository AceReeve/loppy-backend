import { Module } from '@nestjs/common';
import { ModelModule } from '../models/model.module';
import { UserRepository } from './user/user.repository';
import { AuthRepository } from 'src/app/repository/auth/auth.repository';


@Module({
  imports: [ModelModule],
  controllers: [],
  // Inversion
  providers: [

  ],

  exports: [
    ModelModule,
    UserRepository,
    AuthRepository
  ],
})
export class RepositoryModule { }
