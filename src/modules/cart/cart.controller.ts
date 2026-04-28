import {
  Body,
  Controller,
  Delete,
  Get,
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
import { AddToCartDto } from '@/modules/cart/dto/add-to-cart.dto';
import {
  mapCartItemToResponse,
  mapCartToResponse,
} from '@/modules/cart/mappers/cart-to-response.mapper';
import { CartResponse } from '@/modules/cart/types/cart.type';
import { CartItemResponse } from '@/modules/cart/types/cart-item.type';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';
import { UpdateItemQuantityDto } from '@/modules/cart/dto/update-item-quantity.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() { userId }: AuthUser): Promise<CartResponse> {
    const cart: Cart = await this.cartService.getOrCreateCart(userId);

    return mapCartToResponse(cart);
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
    @Body() { quantity }: UpdateItemQuantityDto,
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
