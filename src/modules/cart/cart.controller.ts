import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/modules/auth/types/auth-user.type';
import { CartService } from '@/modules/cart/cart.service';
import { Cart } from '@/modules/cart/entities/cart.entity';
import { CartErrors } from '@/modules/cart/enums/errors.enum';
import { AddToCartDto } from '@/modules/cart/dto/add-to-cart.dto';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() { userId }: AuthUser): Promise<Cart> {
    const cart: Cart | null = await this.cartService.getCart(userId);

    if (!cart) throw new NotFoundException(CartErrors.NOT_FOUND);

    return cart;
  }

  @Get('count')
  async getCartItemsCount(
    @CurrentUser() { userId }: AuthUser,
  ): Promise<number> {
    return this.cartService.getCartItemsCount(userId);
  }

  @Post('items')
  async addItemToCart(
    @CurrentUser() { userId }: AuthUser,
    @Body() payload: AddToCartDto,
  ): Promise<CartItem> {
    return this.cartService.addItemToCart(userId, payload);
  }

  @Delete('items/:bookId')
  async deleteItemFromCart(
    @CurrentUser() { userId }: AuthUser,
    @Param('bookId', ParseIntPipe) bookId: number,
  ): Promise<void> {
    return this.cartService.deleteItemFromCart(userId, bookId);
  }

  @Delete()
  async deleteCart(@CurrentUser() { userId }: AuthUser): Promise<void> {
    return this.cartService.deleteCart(userId);
  }
}
