import { Roles } from '@/modules/user/enums/roles.enum';
import { FindOptionsRelations } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';

export type GetUserOptions = {
  select?: FindOptionsRelations<User>;
  relations?: FindOptionsRelations<User>;
};

export type UserResponse = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Roles;
};

export type GetUsersResponse = {
  content: UserResponse[];
  total: number;
};
