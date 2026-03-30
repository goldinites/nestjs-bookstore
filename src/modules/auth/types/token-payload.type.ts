import { Roles } from '@/modules/user/enums/roles.enum';

export type TokenPayload = { sub: number; email: string; role: Roles };
