import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginDTO } from 'src/app/dto/user';
import { LoginResponseData } from 'src/app/interface/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: UserLoginDTO })
  @ApiResponse({
    status: 201,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 500,
    description: 'An internal error occured',
  })
  async login(@Body() userLoginDTO: UserLoginDTO): Promise<any> {
    return this.authService.login(userLoginDTO);
  }

  //google_auth_signin
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return req.user;
  }

  //facebook_auth_signin
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginCallback(@Req() req): Promise<any> {
    return req.user;
  }
}
