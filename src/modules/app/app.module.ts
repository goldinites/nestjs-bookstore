import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from '@/modules/auth/auth.module';
import { BookModule } from '@/modules/book/book.module';
import { CartModule } from '@/modules/cart/cart.module';
import { UserModule } from '@/modules/user/user.module';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import throttlerConfig from './config/throttler.config';
import { configSchema } from './validation/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, throttlerConfig],
      validate: (config) =>
        configSchema.validateSync(config, {
          abortEarly: false,
          stripUnknown: true,
        }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const ttl = configService.get<number>('throttler.ttl');
        const limit = configService.get<number>('throttler.limit');

        if (!ttl || !limit) throw new Error('Throttler config is not defined');

        return [{ ttl, limit }];
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig =
          configService.get<TypeOrmModuleOptions>('database');

        if (!databaseConfig) throw new Error('Database config is not defined');

        return databaseConfig;
      },
    }),
    AuthModule,
    UserModule,
    BookModule,
    CartModule,
  ],
})
export class AppModule {}
