import { User } from '@/modules/user/entities/user.entity';

export type SafeUser = Omit<User, 'password'>;
