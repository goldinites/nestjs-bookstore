import { BookService } from '@/modules/book/book.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '@/modules/book/entities/book.entity';
import { BookController } from '@/modules/book/book.controller';
import { FileModule } from '@/modules/file/file.module';
import { CategoryModule } from '@/modules/category/category.module';
import { Review } from '@/modules/book/entities/review.entity';
import { ReviewService } from '@/modules/book/services/review.service';
import { ReviewController } from './controllers/review.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Review]),
    CategoryModule,
    FileModule,
  ],
  controllers: [BookController, ReviewController],
  providers: [BookService, ReviewService],
  exports: [BookService],
})
export class BookModule {}
