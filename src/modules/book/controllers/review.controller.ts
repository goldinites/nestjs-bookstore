import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/modules/auth/types/auth-user.type';
import { AddReviewDto } from '@/modules/book/dto/add-review.dto';
import { ReviewResponse } from '@/modules/book/types/book.type';
import { mapReviewToResponse } from '@/modules/book/mappers/book-to-response.mapper';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/user/enums/roles.enum';
import { ToggleIsActiveReviewDto } from '@/modules/book/dto/toggle-is-active-review.dto';
import { UpdateReviewDto } from '@/modules/book/dto/update-review.dto';
import { ReviewService } from '@/modules/book/services/review.service';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('book')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':bookId/review')
  async addReview(
    @CurrentUser() { userId }: AuthUser,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() payload: AddReviewDto,
  ): Promise<ReviewResponse> {
    const review = await this.reviewService.addReview(userId, bookId, payload);

    return mapReviewToResponse(review);
  }

  @Patch(':bookId/review/:reviewId')
  async updateReview(
    @CurrentUser() { userId }: AuthUser,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() payload: UpdateReviewDto,
  ): Promise<ReviewResponse> {
    const review = await this.reviewService.updateReview(
      userId,
      bookId,
      reviewId,
      payload,
    );

    return mapReviewToResponse(review);
  }

  @Permissions(Roles.ADMIN)
  @Patch(':bookId/review/:reviewId/status')
  async toggleIsActiveReview(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() payload: ToggleIsActiveReviewDto,
  ): Promise<ReviewResponse> {
    const review = await this.reviewService.toggleIsActiveReview(
      bookId,
      reviewId,
      payload,
    );

    return mapReviewToResponse(review);
  }

  @Delete(':bookId/review/:reviewId')
  async deleteReview(
    @CurrentUser() user: AuthUser,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ): Promise<void> {
    return await this.reviewService.deleteReview(user, bookId, reviewId);
  }
}
