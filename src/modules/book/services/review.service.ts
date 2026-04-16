import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddReviewDto } from '@/modules/book/dto/add-review.dto';
import { DataSource } from 'typeorm';
import { Review } from '@/modules/book/entities/review.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Book } from '@/modules/book/entities/book.entity';
import { UserErrors } from '@/modules/user/enums/errors.enum';
import { BookErrors, ReviewErrors } from '@/modules/book/enums/errors.enum';

@Injectable()
export class ReviewService {
  constructor(private readonly dataSource: DataSource) {}

  private calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;

    return (
      reviews.reduce((acc, review) => acc + Number(review.rating), 0) /
      reviews.length
    );
  }

  async addReview(userId: number, bookId: number, payload: AddReviewDto) {
    return await this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const bookRepository = manager.getRepository(Book);
      const reviewRepository = manager.getRepository(Review);

      const user = await userRepository.findOneBy({ id: userId });

      if (!user) throw new NotFoundException(UserErrors.NOT_FOUND);

      const book = await bookRepository.findOne({
        where: { id: bookId },
        relations: { reviews: true },
      });

      if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

      const { text, rating } = payload;

      const review = reviewRepository.create({
        user,
        book,
        text,
        rating,
      });

      const result = await reviewRepository.save(review);

      const bookRating = this.calculateAverageRating([...book.reviews, review]);

      const { affected } = await bookRepository.update(bookId, {
        rating: bookRating,
      });

      if (affected === 0) throw new BadRequestException(BookErrors.NOT_UPDATED);

      return result;
    });
  }

  async deleteReview(
    userId: number,
    bookId: number,
    reviewId: number,
  ): Promise<void> {
    return await this.dataSource.transaction(async (manager) => {
      const reviewRepository = manager.getRepository(Review);
      const bookRepository = manager.getRepository(Book);

      const review = await reviewRepository.findOne({
        where: { id: reviewId, user: { id: userId }, book: { id: bookId } },
      });

      if (!review) throw new NotFoundException(ReviewErrors.NOT_FOUND);

      await reviewRepository.remove(review);

      const book = await bookRepository.findOne({
        where: { id: bookId },
        relations: { reviews: true },
      });

      if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

      const bookRating = this.calculateAverageRating(book.reviews);

      const { affected } = await bookRepository.update(bookId, {
        rating: bookRating,
      });

      if (affected === 0) throw new BadRequestException(BookErrors.NOT_UPDATED);
    });
  }
}
