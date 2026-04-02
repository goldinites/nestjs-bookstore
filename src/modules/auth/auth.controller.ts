import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { SignInDto } from '@/modules/auth/dto/sign-in.dto';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import type { AuthUser } from '@/modules/auth/types/auth-user.type';
import { UserResponse } from '@/modules/user/types/user.type';
import { SignInResponse } from '@/modules/auth/types/sign-in.type';
import { RefreshTokenDto } from '@/modules/auth/dto/refresh-token.dto';
import { AuthTokens } from '@/modules/auth/types/auth-tokens.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: RegisterDto): Promise<UserResponse> {
    return await this.authService.register(payload);
  }

  @Post('login')
  async signIn(@Body() payload: SignInDto): Promise<SignInResponse> {
    return await this.authService.signIn(payload);
  }

  @Post('refresh')
  async refresh(@Body() payload: RefreshTokenDto): Promise<AuthTokens> {
    return await this.authService.refresh(payload);
  }

  @Post('logout')
  async logout(@Body() payload: RefreshTokenDto): Promise<void> {
    return await this.authService.logout(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() { userId }: AuthUser): Promise<UserResponse> {
    return await this.authService.me(userId);
  }
}
