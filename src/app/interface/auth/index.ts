import { UserLoginDTO } from 'src/app/dto/user';

export abstract class AbstractAuthService {
  abstract login(userLoginDTO: UserLoginDTO): Promise<LoginResponseData | null>;
}

export interface LoginResponseData {
  _id: string;
  first_name: string;
  last_name: string;
  access_token: string;
  email?: string;
  status?: string;
  verified_email?: boolean;
}

export interface AccessToken {
  access_token: string;
}
export interface TokenPayload {
  email: string;
  exp: number;
  [key: string]: object | string | number;
}

export interface AuthInfoRequest<T> extends Request {
  user: T;
  token: string;
}
