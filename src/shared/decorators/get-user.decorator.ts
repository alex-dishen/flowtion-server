import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadT } from 'src/api/auth/types/types';

export const GetUser = createParamDecorator((data: keyof JwtPayloadT | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (data) return request.user[data];

  return request.user;
});
