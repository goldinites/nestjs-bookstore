import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
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
import {
  mapCartItemToResponse,
  mapCartToResponse,
} from '@/modules/cart/mappers/cart-to-response.mapper';
import { CartResponse } from '@/modules/cart/types/cart.type';
import { CartItemResponse } from '@/modules/cart/types/cart-item.type';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() { userId }: AuthUser): Promise<CartResponse> {
    const cart: Cart | null = await this.cartService.getCart(userId);

    if (!cart) throw new NotFoundException(CartErrors.NOT_FOUND);

    return mapCartToResponse(cart);
  }

  @Get('count')
  async getCartItemsCount(
    @CurrentUser() { userId }: AuthUser,
  ): Promise<number> {
    return await this.cartService.getCartItemsCount(userId);
  }

  @Post('items')
  async addItemToCart(
    @CurrentUser() { userId }: AuthUser,
    @Body() payload: AddToCartDto,
  ): Promise<CartItemResponse> {
    const item: CartItem = await this.cartService.addItemToCart(
      userId,
      payload,
    );

    return mapCartItemToResponse(item);
  }

  @Patch('items/:bookId')
  async updateItemQuantity(
    @CurrentUser() { userId }: AuthUser,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ): Promise<CartItemResponse | void> {
    const item: CartItem | void = await this.cartService.updateItemQuantity(
      userId,
      bookId,
      quantity,
    );

    if (!item) return;

    return mapCartItemToResponse(item);
  }

  @Delete('items/:bookId')
  async deleteItemFromCart(
    @CurrentUser() { userId }: AuthUser,
    @Param('bookId', ParseIntPipe) bookId: number,
  ): Promise<void> {
    return await this.cartService.deleteItemFromCart(userId, bookId);
  }

  @Delete()
  async deleteCart(@CurrentUser() { userId }: AuthUser): Promise<void> {
    return await this.cartService.deleteCart(userId);
  }
}
