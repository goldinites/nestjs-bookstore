import { Module } from '@nestjs/common';
import { BookModule } from '@/modules/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { CartModule } from '@/modules/cart/cart.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USERNAME,
      autoLoadEntities: true,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UserModule,
    BookModule,
    CartModule,
  ],
})
export class AppModule {}
