import { Module } from '@nestjs/common';
import { BookModule } from '@/modules/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '@/modules/book/entities/book.entity';
import { AppController } from '@/modules/app/app.controller';
import { AppService } from '@/modules/app/app.service';
import { User } from '@/modules/user/entities/user.entity';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AppController],
  providers: [AppService],
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
      database: 'nest-learn',
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    UserModule,
    BookModule,
  ],
})
export class AppModule {}
