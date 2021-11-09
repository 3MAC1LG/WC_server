import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { response } from 'express';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getResponse();
    return response.locals.jwt;
  },
);