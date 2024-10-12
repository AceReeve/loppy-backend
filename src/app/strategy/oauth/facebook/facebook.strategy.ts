import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { OauthRepository } from 'src/app/repository/oauth/oauth.repository';
import { SignInBy } from 'src/app/const';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly oauthRepository: OauthRepository,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID'),
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_APP_URL'),
      scope: 'email',
      profileFields: ['id', 'emails', 'name'],
    });
  }
  //generate jwt token
  generateJWT(payload: object, exp: string): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    const { name, emails } = profile;

    //use jwt token instead of token provided by facebook
    const payload = { email: emails[0].value };
    const access_token = this.generateJWT(
      payload,
      this.configService.get<string>('JWT_EXPIRATION'),
    );
    //----//
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      accessToken: access_token,
    };
    done(null, user);
    await this.oauthRepository.recordLogin(user, SignInBy.SIGN_IN_BY_FACEBOOK);
  }
}
