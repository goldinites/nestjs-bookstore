import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Cart } from '@/modules/cart/entities/cart.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AddToCartDto } from '@/modules/cart/dto/add-to-cart.dto';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';
import { CartErrors } from '@/modules/cart/enums/errors.enum';
import { Book } from '@/modules/book/entities/book.entity';
import { BookErrors } from '@/modules/book/enums/errors.enum';

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
    const { bookId, quantity } = payload;

    if (quantity <= 0)
      throw new BadRequestException(CartErrors.QUANTITY_NOT_ENOUGH);

    return await this.dataSource.transaction(async (manager) => {
      const bookRepository = manager.getRepository(Book);
      const cartRepository = manager.getRepository(Cart);
      const cartItemRepository = manager.getRepository(CartItem);

      const book = await bookRepository.findOne({
        where: { id: bookId },
      });

      if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

      let cart = await cartRepository.findOne({
        where: { user: { id: userId } },
      });

      if (!cart) {
        cart = cartRepository.create({
          user: { id: userId },
          items: [],
        });

        cart = await cartRepository.save(cart);
      }

      const existingItem = await cartItemRepository.findOne({
        where: {
          cart: { id: cart.id },
          book: { id: bookId },
        },
      });

      if (existingItem) {
        const nextQuantity = existingItem.quantity + quantity;

        if (nextQuantity > book.stockCount)
          throw new BadRequestException(CartErrors.QUANTITY_NOT_AVAILABLE);

        existingItem.quantity = nextQuantity;

        return cartItemRepository.save(existingItem);
      }

      if (quantity > book.stockCount)
        throw new BadRequestException(CartErrors.QUANTITY_NOT_AVAILABLE);

      const item = cartItemRepository.create({
        cart,
        book,
        quantity,
      });

      return cartItemRepository.save(item);
    });
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
