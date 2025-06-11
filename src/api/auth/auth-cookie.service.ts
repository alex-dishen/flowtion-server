import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';

@Injectable()
export class AuthCookieService {
  private readonly REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
  private readonly REFRESH_TOKEN_EXPIRY = 21600 * 900000; // 225 days

  setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY),
      signed: true,
    });
  }

  getRefreshTokenFromRequest(req: Request): string {
    let refreshToken = req.signedCookies[this.REFRESH_TOKEN_COOKIE_NAME];

    if (!refreshToken && req.body[this.REFRESH_TOKEN_COOKIE_NAME]) {
      refreshToken = req.body[this.REFRESH_TOKEN_COOKIE_NAME];
    }

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in request');
    }

    return refreshToken;
  }

  clearRefreshTokenCookie(res: Response) {
    res.clearCookie(this.REFRESH_TOKEN_COOKIE_NAME);
  }
}
