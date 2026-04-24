import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddReviewDto } from '@/modules/book/dto/add-review.dto';
import { DataSource, EntityManager } from 'typeorm';
import { Review } from '@/modules/book/entities/review.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Book } from '@/modules/book/entities/book.entity';
import { UserErrors } from '@/modules/user/enums/errors.enum';
import { BookErrors, ReviewErrors } from '@/modules/book/enums/errors.enum';
import { UpdateReviewDto } from '@/modules/book/dto/update-review.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { AuthUser } from '@/modules/auth/types/auth-user.type';
import { Roles } from '@/modules/user/enums/roles.enum';

@Injectable()
export class ReviewService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  private calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;

    return (
      reviews.reduce((acc, review) => acc + Number(review.rating), 0) /
      reviews.length
    );
  }

  private async updateBookRating(manager: EntityManager, bookId: number) {
    const bookRepository = manager.getRepository(Book);

    const book = await bookRepository.findOne({
      where: { id: bookId },
      relations: { reviews: true },
    });

    if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

    const newBookRating = this.calculateAverageRating(book.reviews);

    const { affected } = await bookRepository.update(bookId, {
      rating: newBookRating,
    });

    if (affected === 0) throw new BadRequestException(BookErrors.NOT_UPDATED);
  }

  async addReview(userId: number, bookId: number, payload: AddReviewDto) {
    return await this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const bookRepository = manager.getRepository(Book);
      const reviewRepository = manager.getRepository(Review);

      const isExists = await reviewRepository.findOne({
        where: { user: { id: userId }, book: { id: bookId } },
      });

      if (isExists) throw new BadRequestException(ReviewErrors.ALREADY_EXISTS);

      const user = await userRepository.findOneBy({ id: userId });

      if (!user) throw new NotFoundException(UserErrors.NOT_FOUND);

      const book = await bookRepository.findOneBy({ id: bookId });

      if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

      const { text, rating } = payload;

      const review = reviewRepository.create({
        user,
        book,
        text,
        rating,
      });

      const result = await reviewRepository.save(review);

      await this.updateBookRating(manager, bookId);

      return result;
    });
  }

  async updateReview(
    userId: number,
    reviewId: number,
    payload: UpdateReviewDto,
  ): Promise<Review> {
    return await this.dataSource.transaction(async (manager) => {
      const reviewRepository = manager.getRepository(Review);

      const review = await reviewRepository.findOne({
        where: { id: reviewId },
        relations: { book: true },
      });

      if (!review) throw new NotFoundException(ReviewErrors.NOT_FOUND);

      if (userId !== review.user.id)
        throw new BadRequestException(ReviewErrors.CANNOT_UPDATE);

      const { affected } = await reviewRepository.update(reviewId, payload);

      if (affected === 0)
        throw new BadRequestException(ReviewErrors.NOT_UPDATED);

      if (payload.rating !== review.rating) {
        await this.updateBookRating(manager, review.book.id);
      }

      const updated = await reviewRepository.findOneBy({ id: reviewId });

      if (!updated) throw new NotFoundException(ReviewErrors.NOT_FOUND);

      return updated;
    });
  }

  async deleteReview(user: AuthUser, reviewId: number): Promise<void> {
    return await this.dataSource.transaction(async (manager) => {
      const reviewRepository = manager.getRepository(Review);

      const review = await reviewRepository.findOne({
        where: { id: reviewId },
        relations: { user: true, book: true },
      });

      if (!review) throw new NotFoundException(ReviewErrors.NOT_FOUND);

      if (user.userId !== review.user.id && user.role !== Roles.ADMIN)
        throw new BadRequestException(ReviewErrors.CANNOT_DELETE);

      await reviewRepository.remove(review);

      await this.updateBookRating(manager, review.book.id);
    });
  }
}
