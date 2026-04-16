import { Injectable, NotFoundException } from '@nestjs/common';
import { AddReviewDto } from '@/modules/book/dto/add-review.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '@/modules/book/entities/review.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Book } from '@/modules/book/entities/book.entity';
import { UserErrors } from '@/modules/user/enums/errors.enum';
import { BookErrors, ReviewErrors } from '@/modules/book/enums/errors.enum';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly dataSource: DataSource,
  ) {}

  async addReview(userId: number, bookId: number, payload: AddReviewDto) {
    return await this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const bookRepository = manager.getRepository(Book);
      const reviewRepository = manager.getRepository(Review);

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

      return await reviewRepository.save(review);
    });
  }

  async deleteReview(userId: number, bookId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { user: { id: userId }, book: { id: bookId } },
    });

    if (!review) throw new NotFoundException(ReviewErrors.NOT_FOUND);

    await this.reviewRepository.remove(review);
  }
}
