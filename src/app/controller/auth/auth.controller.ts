import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  SetMetadata,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleSaveDTO, UserLoginDTO } from 'src/app/dto/user';
import { LoginResponseData } from 'src/app/interface/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { HttpGoogleOAuthGuard } from '../../guard/http-google-oauth.guard';
import { HttpUser } from '../../decorators/http-user.decorator';
import { GoogleLoginUserDto } from '../../dto/auth/google-login.dto';
import { Public } from '../../decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
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
  @SetMetadata('google-login', true)
  @UseGuards(HttpGoogleOAuthGuard)
  @Get('google')
  googleAuth(@Req() req) {
    console.log('CALLED GOOGLE LOGIN', req);
  }

  @SetMetadata('google-login', true)
  @UseGuards(HttpGoogleOAuthGuard)
  @Get('google/callback')
  googleAuthRedirect(@HttpUser() user: GoogleLoginUserDto) {
    console.log('CALLED CALLBACK');
    return this.authService.googleLogin(user);
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

  @Public()
  @Post('google-save')
  @ApiBody({ type: GoogleSaveDTO })
  @ApiResponse({
    status: 201,
    description: 'save successful',
  })
  @ApiResponse({
    status: 500,
    description: 'An internal error occured',
  })
  async googleSave(@Body() googleSaveDTO: GoogleSaveDTO): Promise<any> {
    console.log(
      'this is inside the controller and this is the payload:',
      googleSaveDTO,
    );
    return this.authService.googleSave(googleSaveDTO);
  }
}
