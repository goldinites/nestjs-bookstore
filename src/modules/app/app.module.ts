import { Module } from '@nestjs/common';
import { BookModule } from '@/modules/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { CartModule } from '@/modules/cart/cart.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  DEFAULT_DB_PORT,
  DEFAULT_THROTTLE_LIMIT,
  DEFAULT_THROTTLE_TTL,
} from '@/modules/app/constants/app.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>(
            'RATE_LIMIT_TTL',
            DEFAULT_THROTTLE_TTL,
          ),
          limit: configService.get<number>(
            'RATE_LIMIT_MAX',
            DEFAULT_THROTTLE_LIMIT,
          ),
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', DEFAULT_DB_PORT),
        password: configService.get<string>('DB_PASSWORD'),
        username: configService.get<string>('DB_USERNAME'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    AuthModule,
    UserModule,
    BookModule,
    CartModule,
  ],
})
export class AppModule {}
