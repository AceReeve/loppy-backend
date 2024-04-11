import { Injectable } from '@nestjs/common';
import { AuthRepository } from 'src/app/repository/auth/auth.repository';
import { LoginResponseData } from 'src/app/interface/user';
import { UserLoginDTO } from 'src/app/dto/user/index';
import { GoogleLoginUserDto } from '../../dto/auth/google-login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(userLoginDTO: UserLoginDTO): Promise<any> {
    return await this.authRepository.login(userLoginDTO);
  }

  async googleLogin(user: GoogleLoginUserDto) {
    return await this.authRepository.googleLogin(user);
  }
}
