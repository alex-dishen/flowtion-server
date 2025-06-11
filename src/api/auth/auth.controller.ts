import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AccessTokenDto, SignUpDto, SingInDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { AuthCookieService } from './auth-cookie.service';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cookieService: AuthCookieService,
  ) {}

  @ApiOperation({ summary: 'Create a user' })
  @Post('/sign-up')
  async signUp(@Body() data: SignUpDto, @Res({ passthrough: true }) res: Response): Promise<AccessTokenDto> {
    const authResult = await this.authService.signUp(data);
    this.cookieService.setRefreshTokenCookie(res, authResult.refresh_token);

    return { access_token: authResult.access_token };
  }

  @ApiOperation({ summary: 'Sign in into the system' })
  @Post('/sign-in')
  async signIn(@Body() data: SingInDto, @Res({ passthrough: true }) res: Response): Promise<AccessTokenDto> {
    const authResult = await this.authService.signIn(data);
    this.cookieService.setRefreshTokenCookie(res, authResult.refresh_token);

    return { access_token: authResult.access_token };
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @GetUser('sub') userId: string,
  ): Promise<AccessTokenDto> {
    const refreshToken = this.cookieService.getRefreshTokenFromRequest(req);
    const authResult = await this.authService.refreshAccessToken(userId, refreshToken);
    this.cookieService.setRefreshTokenCookie(res, authResult.refresh_token);

    return { access_token: authResult.access_token };
  }

  @ApiOperation({ summary: 'Logout a user from the system' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @GetUser('sub') userId: string,
  ): Promise<MessageDto> {
    const refreshToken = this.cookieService.getRefreshTokenFromRequest(req);
    const logOutResponse = await this.authService.logout(userId, refreshToken);
    this.cookieService.clearRefreshTokenCookie(res);

    return logOutResponse;
  }
}
