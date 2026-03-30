import { SetMetadata } from '@nestjs/common';
import { Roles as UserRoles } from '@/modules/user/enums/roles.enum';
import { ROLES_KEY } from '@/modules/auth/constants/auth.constants';

export const Permissions = (...roles: UserRoles[]) =>
  SetMetadata(ROLES_KEY, roles);
