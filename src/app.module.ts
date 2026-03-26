import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book/entities/book.entity';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      password: '123456',
      username: 'root',
      entities: [Book],
      database: 'nest-learn',
      synchronize: true,
      logging: true,
    }),
    BookModule,
  ],
})
export class AppModule {}
