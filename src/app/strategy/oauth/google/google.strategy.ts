import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OauthRepository } from 'src/app/repository/oauth/oauth.repository';
import { SignInBy } from 'src/app/const';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly oauthRepository: OauthRepository,
    private readonly jwtService: JwtService,

  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CLIENT_URL'),
      scope: ['email', 'profile'],
    });
  }
  //generate jwt token
  generateJWT(payload: object, exp: string): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION')
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    //use jwt token instead of token provided by google
    const payload = { email: emails[0].value };
    const access_token = this.generateJWT(payload, this.configService.get<string>('JWT_EXPIRATION'));
    //----//
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken: access_token,
    };
    done(null, user);
    await this.oauthRepository.recordLogin(user, SignInBy.SIGN_IN_BY_GOOGLE);
  }
}
