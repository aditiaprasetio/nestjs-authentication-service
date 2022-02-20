import { Injectable } from '@nestjs/common';
import { AccountService } from '../auth/account/account.service';
import { JwtService } from '@nestjs/jwt';
import { Account } from '../auth/account/account.entity';
import { LoginDto, ResetPasswordDto, SendLinkResetPasswordDto } from './auth.dto';
import * as crypto from 'crypto';
import { LoginByGoogleDto } from './authGoogle.dto';
import { OAuth2Client } from 'google-auth-library';

type VerifyGoogleTokenResponse = {
 // These six fields are included in all Google ID Tokens.
 iss: string;
 sub: string;
 azp: string;
 aud: string;
 iat: string;
 exp: string;

 // These seven fields are only included when the user has granted the profile and
 // email OAuth scopes to the application.
 email: string;
 email_verified: string;
 name : string;
 picture: string;
 given_name: string;
 family_name: string;
 locale: string;
}

// {
//  // These six fields are included in all Google ID Tokens.
//  "iss": "https://accounts.google.com",
//  "sub": "110169484474386276334",
//  "azp": "1008719970978-hb24n2dstb40o45d4feuo2ukqmcc6381.apps.googleusercontent.com",
//  "aud": "1008719970978-hb24n2dstb40o45d4feuo2ukqmcc6381.apps.googleusercontent.com",
//  "iat": "1433978353",
//  "exp": "1433981953",

//  // These seven fields are only included when the user has granted the "profile" and
//  // "email" OAuth scopes to the application.
//  "email": "testuser@gmail.com",
//  "email_verified": "true",
//  "name" : "Test User",
//  "picture": "https://lh4.googleusercontent.com/-kYgzyAWpZzJ/ABCDEFGHI/AAAJKLMNOP/tIXL9Ir44LE/s99-c/photo.jpg",
//  "given_name": "Test",
//  "family_name": "User",
//  "locale": "en"
// }

const CLIENT_ID = '';

@Injectable()
export class AuthService {
  private client: any;
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {
    this.client = new OAuth2Client(CLIENT_ID);
  }

  public async validateToken(token: string): Promise<Account> {
    return await this.jwtService.verify(token);
  }

  private async validate(accountData: LoginDto): Promise<Account> {
    return await this.accountService.login(accountData);
  }

  public async login(account: LoginDto): Promise<any | { status: number }> {
    account = {
      ...account,
      password: crypto.createHmac('sha256', account.password).digest('hex'),
    };
    return this.validate(account).then(accountData => {
      if (!accountData) {
        return { status: 404, message: 'Login failed' };
      }
      delete accountData.password;
      const payload = {
        ...accountData,
      };
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '1h',
        algorithm: 'HS256',
      });

      return {
        expires_in: 3600,
        access_token: accessToken,
        // data: payload,
        // status: 200,
      };
    });
  }

  public async register(account: Account): Promise<any> {
    try {
      return this.accountService.create(account);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<Account> {
    try {
      return await this.accountService.resetPassword(dto);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async sendLinkResetPassword(dto: SendLinkResetPasswordDto): Promise<any> {
    try {
      return await this.accountService.sendLinkResetPassword(dto);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  // AUTH BY GOOGLE
  async verify(token: string) {
    const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload: VerifyGoogleTokenResponse = ticket.getPayload();
    // const userId = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return payload;
  }

  public async loginByGoogle(dto: LoginByGoogleDto): Promise<any | { status: number }> {
    // verify token
    const authData = await this.verify(dto.token);
    const accountData = await this.accountService.findByEmail(authData.email)

    const payload = {
      ...accountData,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
      algorithm: 'HS256',
    });

    return {
      expires_in: 3600,
      access_token: accessToken,
      // data: payload,
      // status: 200,
    };
  }
}
