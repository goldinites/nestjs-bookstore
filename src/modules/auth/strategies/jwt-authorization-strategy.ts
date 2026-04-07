import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthUser } from '@/modules/auth/types/auth-user.type';
import { ConfigService } from '@nestjs/config';
import { AuthErrors } from '@/modules/auth/enums/errors.enum';
import { TokenPayload } from '@/modules/auth/types/token-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const secret: string | undefined =
      configService.get<string>('jwt.access.secret');

    if (!secret) throw new Error(AuthErrors.SECRET_KEY_NOT_DEFINED);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: TokenPayload): AuthUser {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
