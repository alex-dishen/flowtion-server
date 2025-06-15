import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AppConfigService } from '../services/config-service/config.service';
import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';

export const IgnoreAuthGuard = () => SetMetadata('isAuthGuardIgnored', true);

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private config: AppConfigService,
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isIgnoreTenantGuard = this.reflector.get<boolean>('isAuthGuardIgnored', context.getHandler());

    if (isIgnoreTenantGuard) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('ACCESS_SECRET'),
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
