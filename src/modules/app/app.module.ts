import { Module } from '@nestjs/common';
import { BookModule } from '@/modules/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '@/modules/book/entities/book.entity';
import { User } from '@/modules/user/entities/user.entity';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
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
      entities: [Book, User],
      database: process.env.DB_NAME,
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UserModule,
    BookModule,
  ],
})
export class AppModule {}
