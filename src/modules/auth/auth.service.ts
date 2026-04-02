import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { SignInDto } from '@/modules/auth/dto/sign-in.dto';
import { User } from '@/modules/user/entities/user.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { AuthErrors } from '@/modules/auth/enums/errors.enum';
import { TokenPayload } from '@/modules/auth/types/token-payload.type';
import { SignInResponse } from '@/modules/auth/types/sign-in.type';
import { UserErrors } from '@/modules/user/enums/errors.enum';
import { UserResponse } from '@/modules/user/types/user.type';
import { mapUserToResponse } from '@/modules/user/mappers/user-to-response.mapper';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(payload: RegisterDto): Promise<UserResponse> {
    const existingUser: User | null = await this.userService.findByEmail(
      payload.email,
    );

    if (existingUser)
      throw new ConflictException(AuthErrors.USER_ALREADY_EXISTS);

    const newUser: User = await this.userService.create(payload);

    return mapUserToResponse(newUser);
  }

  async signIn(payload: SignInDto): Promise<SignInResponse> {
    const user: User | null = await this.userService.findByEmail(payload.email);

    if (!user) throw new UnauthorizedException(AuthErrors.WRONG_CREDENTIALS);

    const isMatch: boolean = await argon2.verify(
      user.password,
      payload.password,
    );

    if (!isMatch) throw new UnauthorizedException(AuthErrors.WRONG_CREDENTIALS);

    const tokenPayload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(tokenPayload),
    };
  }

  async me(id: number): Promise<UserResponse> {
    const user: User | null = await this.userService.findById(id);

    if (!user) throw new NotFoundException(UserErrors.NOT_FOUND);

    return mapUserToResponse(user);
  }
}
