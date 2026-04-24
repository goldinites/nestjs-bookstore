import { Roles } from '@/modules/user/enums/roles.enum';

export const ROLES_KEY: string = 'roles';

export const PERMISSIONS_MAP: Record<Roles, Roles[]> = {
  [Roles.ADMIN]: [Roles.USER, Roles.ADMIN],
  [Roles.USER]: [Roles.USER],
};
