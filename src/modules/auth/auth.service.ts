import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { SignInDto } from '@/modules/auth/dto/sign-in.dto';
import { User } from '@/modules/user/entities/user.entity';
import argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { AuthErrors } from '@/modules/auth/enums/errors.enum';
import { TokenPayload } from '@/modules/auth/types/token-payload.type';
import { SignInResponse } from '@/modules/auth/types/sign-in.type';
import { UserErrors } from '@/modules/user/enums/errors.enum';
import { AuthTokens } from '@/modules/auth/types/auth-tokens.type';
import { RefreshTokenPayload } from '@/modules/auth/types/refresh-token-payload.type';
import { RedisTokenService } from '@/modules/auth/services/redis-token.service';
import { RefreshTokenDto } from '@/modules/auth/dto/refresh-token.dto';
import { parseTtlToSeconds } from '@/modules/utils/parse-ttl-to-seconds';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_REFRESH_TOKEN_TTL } from '@/modules/app/constants/app.constants';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { Roles } from '@/modules/user/enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly redisTokenService: RedisTokenService,
    private readonly configService: ConfigService,
  ) {}

  async register(payload: RegisterDto): Promise<SignInResponse> {
    const existingUser: User | null = await this.userService.getUserByEmail(
      payload.email,
    );

    if (existingUser)
      throw new ConflictException(AuthErrors.USER_ALREADY_EXISTS);

    try {
      await this.userService.createUser(payload);

      return await this.signIn({
        email: payload.email,
        password: payload.password,
      });
    } catch {
      throw new BadRequestException(AuthErrors.REGISTER_FAILED);
    }
  }

  async signIn(payload: SignInDto): Promise<SignInResponse> {
    const user: User | null = await this.userService.getUserByEmail(
      payload.email,
    );

    if (!user) throw new UnauthorizedException(AuthErrors.WRONG_CREDENTIALS);

    const isMatch: boolean = await argon2.verify(
      user.password,
      payload.password,
    );

    if (!isMatch) throw new UnauthorizedException(AuthErrors.WRONG_CREDENTIALS);

    return await this.generateTokens(user);
  }

  async refresh(payload: RefreshTokenDto): Promise<AuthTokens> {
    let decoded: RefreshTokenPayload;

    try {
      decoded = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        payload.refreshToken,
        {
          secret: this.configService.get<string>('jwt.refresh.secret'),
        },
      );
    } catch {
      throw new UnauthorizedException(AuthErrors.WRONG_CREDENTIALS);
    }

    const userId: number = decoded.sub;

    const storedRefreshToken: string | null =
      await this.redisTokenService.getRefreshToken(userId);

    if (!storedRefreshToken || storedRefreshToken !== payload.refreshToken) {
      throw new UnauthorizedException(AuthErrors.WRONG_CREDENTIALS);
    }

    const user: User | null = await this.userService.getUserById(userId);

    if (!user) throw new NotFoundException(UserErrors.NOT_FOUND);

    await this.redisTokenService.deleteRefreshToken(userId);

    return await this.generateTokens(user);
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const accessPayload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
    };

    const ttlSeconds: number = parseTtlToSeconds(
      this.configService.get<string>(
        'jwt.refresh.expiresIn',
        DEFAULT_REFRESH_TOKEN_TTL,
      ),
    );

    const accessToken: string = await this.jwtService.signAsync(accessPayload);
    const refreshToken: string = await this.jwtService.signAsync(
      refreshPayload,
      {
        secret: this.configService.get<string>('jwt.refresh.secret'),
        expiresIn: ttlSeconds,
      },
    );

    await this.redisTokenService.setRefreshToken(
      user.id,
      refreshToken,
      ttlSeconds,
    );

    return { accessToken, refreshToken };
  }

  async logout(payload: RefreshTokenDto): Promise<void> {
    try {
      const decoded = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        payload.refreshToken,
        {
          secret: this.configService.get<string>('jwt.refresh.secret'),
        },
      );

      await this.redisTokenService.deleteRefreshToken(decoded.sub);
    } catch {
      return;
    }
  }

  async getMe(id: number): Promise<User> {
    const user: User | null = await this.userService.getUserById(id);

    if (!user) throw new NotFoundException(UserErrors.NOT_FOUND);

    return user;
  }

  async updateMe(
    id: number,
    role: Roles,
    payload: UpdateUserDto,
  ): Promise<User> {
    const user: User | null = await this.userService.updateUser(
      id,
      payload,
      role,
    );

    if (!user) throw new BadRequestException(UserErrors.NOT_UPDATED);

    return user;
  }

  async deleteMe(id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
