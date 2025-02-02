import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { config } from '../config/config.service';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('JWT token is missing');
    }

    let payload: any;
    try {
      console.log(
        `token ${token} process.env.JWT_SECRET :${config().jwtSecret} `,
      );
      payload = this.jwtService.verify(token, {
        secret: config().jwtSecret,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    if (!requiredRoles.includes(payload.role)) {
      throw new ForbiddenException(
        `User does not have the required role: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
