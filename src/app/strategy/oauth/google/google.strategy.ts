import { PassportStrategy } from '@nestjs/passport';
import {
  GoogleCallbackParameters,
  Profile,
  Strategy,
  VerifyCallback,
} from 'passport-google-oauth20';
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
    super(
      {
        clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
        clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
        callbackURL: configService.get<string>('GOOGLE_CLIENT_URL'),
        scope: ['email', 'profile'],
      },
      async (
        accessToken: string,
        refreshToken: string,
        params: GoogleCallbackParameters,
        profile: Profile,
        done: VerifyCallback,
      ) => {
        console.log('validate');
        // const { expires_in, id_token } = profile;
        console.log('profile', profile);
        console.log('refreshToken', refreshToken);
        console.log('accessToken', accessToken);
        const { expires_in, id_token } = params;
        const {
          id,
          name,
          emails,
          photos,
          _json: { email_verified },
        } = profile;
        const user = {
          providerAccountId: id,
          email: emails[0].value,
          email_verified,
          firstName: name.givenName,
          lastName: name.familyName,
          picture: photos[0].value,
          accessToken,
          refreshToken,
          id_token,
          expires_in,
        };
        done(null, user);
      },
    );
  }
  //generate jwt token
  generateJWT(payload: object, exp: string): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
    });
  }
  // async validate(
  //   accessToken: string,
  //   refreshToken: string,
  //   profile: Profile,
  //   done: VerifyCallback,
  // ): Promise<any> {
  //   console.log('validate');
  //   // const { expires_in, id_token } = profile;
  //   console.log('profile', profile);
  //   console.log('refreshToken', refreshToken);
  //   console.log('accessToken', accessToken);
  //   const {
  //     id,
  //     name,
  //     emails,
  //     photos,
  //     _json: { email_verified },
  //   } = profile;
  //   //use jwt token instead of token provided by google
  //   const payload = { email: emails[0].value };
  //   const access_token = this.generateJWT(
  //     payload,
  //     this.configService.get<string>('JWT_EXPIRATION'),
  //   );
  //   //----//
  //   const user = {
  //     providerAccountId: id,
  //     email: emails[0].value,
  //     email_verified,
  //     firstName: name.givenName,
  //     lastName: name.familyName,
  //     picture: photos[0].value,
  //     accessToken: access_token,
  //     refreshToken,
  //     // id_token,
  //     // expires_in,
  //   };
  //   done(null, user);
  //   // await this.oauthRepository.recordLogin(user, SignInBy.SIGN_IN_BY_GOOGLE);
  // }
}
