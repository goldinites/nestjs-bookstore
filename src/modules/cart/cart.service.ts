import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Cart } from '@/modules/cart/entities/cart.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AddToCartDto } from '@/modules/cart/dto/add-to-cart.dto';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';
import { CartErrors } from '@/modules/cart/enums/errors.enum';
import { addToCart } from '@/modules/cart/services/add-to-cart';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getCart(userId: number): Promise<Cart | null> {
    return await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: { items: true },
    });
  }

  async getCartItemsCount(userId: number): Promise<number> {
    const cart: Cart | null = await this.getCart(userId);

    if (!cart) throw new NotFoundException(CartErrors.NOT_FOUND);

    return cart.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  async addItemToCart(
    userId: number,
    payload: AddToCartDto,
  ): Promise<CartItem> {
    return await addToCart(this.dataSource, userId, payload);
  }

  async deleteItemFromCart(userId: number, bookId: number): Promise<void> {
    const cart: Cart | null = await this.getCart(userId);

    if (!cart) throw new NotFoundException(CartErrors.NOT_FOUND);

    const item: CartItem | null = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cart.id },
        book: { id: bookId },
      },
    });

    if (!item) throw new NotFoundException(CartErrors.CART_ITEM_NOT_FOUND);

    await this.cartItemRepository.remove(item);
  }

  async deleteCart(userId: number): Promise<void> {
    const cart: Cart | null = await this.getCart(userId);

    if (!cart) throw new NotFoundException(CartErrors.NOT_FOUND);

    await this.cartRepository.remove(cart);
  }
}
