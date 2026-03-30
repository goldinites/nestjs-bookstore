import { Roles } from '@/modules/user/enums/roles.enum';

export type AuthUser = {
  userId: number;
  email: string;
  role: Roles;
};

export type RequestWithUser = {
  user: AuthUser;
};
