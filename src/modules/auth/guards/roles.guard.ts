import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '@/modules/user/enums/roles.enum';
import { RequestWithUser } from '@/modules/auth/types/auth-user.type';
import { AuthErrors } from '@/modules/auth/enums/errors.enum';
import {
  ROLES_KEY,
  PERMISSIONS_MAP,
} from '@/modules/auth/constants/auth.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userRole: Roles | undefined = request.user?.role;

    if (!userRole) throw new ForbiddenException(AuthErrors.PERMISSION_DENIED);

    const allowedRoles = PERMISSIONS_MAP[userRole] ?? [];

    const hasPermission = requiredRoles.some((role) =>
      allowedRoles.includes(role),
    );

    if (!hasPermission)
      throw new ForbiddenException(AuthErrors.PERMISSION_DENIED);

    return true;
  }
}
