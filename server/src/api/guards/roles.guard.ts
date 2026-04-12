import { ROLES_KEY } from '@api/decorators/roles.decorator';
import { AuthenticatedRequest } from '@api/guards/models/authenticated-request.interface';
import { Role } from '@domain/entities/enums/role.enum';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Недостаточно прав');
    }

    return true;
  }
}
