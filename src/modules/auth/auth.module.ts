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
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_ACCESS_EXPIRES_IN') },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RedisTokenService],
  exports: [AuthService],
})
export class AuthModule {}
