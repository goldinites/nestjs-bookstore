import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@/modules/user/user.module';
import { JwtStrategy } from '@/modules/auth/strategies/jwt-authorization-strategy';
import { ConfigService } from '@nestjs/config';
import { RedisTokenService } from '@/modules/auth/services/redis-token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.access.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.access.expiresIn'),
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RedisTokenService],
  exports: [AuthService],
})
export class AuthModule {}
