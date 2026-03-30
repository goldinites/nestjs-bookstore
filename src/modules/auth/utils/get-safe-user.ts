import { SafeUser } from '@/modules/auth/types/register.type';
import { User } from '@/modules/user/entities/user.entity';

export function getSafeUser(user: User): SafeUser {
  const { password, ...result } = user;
  void password;

  return result;
}
