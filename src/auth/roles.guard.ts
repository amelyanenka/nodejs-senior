import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const accessRole = this.reflector.get<string>('role', context.getHandler());
    if (!accessRole) {
      return true;
    }

    try {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      const authHeader = request.headers.authorization;

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        sub: string;
        role: string;
        iat: number;
        exp: number;
      };
      const { role } = decoded;

      return role === accessRole;
    } catch (error) {
      return false;
    }
  }
}
