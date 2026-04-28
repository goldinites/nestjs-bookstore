import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Cart } from '@/modules/cart/entities/cart.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { AddToCartDto } from '@/modules/cart/dto/add-to-cart.dto';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';
import { CartErrors } from '@/modules/cart/enums/errors.enum';
import { Book } from '@/modules/book/entities/book.entity';
import { BookErrors } from '@/modules/book/enums/errors.enum';
import { GetCartOptions } from '@/modules/cart/types/cart.type';

@Injectable()
export class CartService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getCart(userId: number, options: GetCartOptions = {}): Promise<Cart> {
    return await this.dataSource.transaction(async (manager) => {
      const cartRepository = manager.getRepository(Cart);

      const { select, relations } = options;

      let cart = await cartRepository.findOne({
        where: { user: { id: userId } },
        relations,
        select,
      });

      if (!cart) {
        cart = cartRepository.create({
          user: { id: userId },
          items: [],
        });

        cart = await cartRepository.save(cart);
      }

      return cart;
    });
  }

  async addItemToCart(
    userId: number,
    payload: AddToCartDto,
  ): Promise<CartItem> {
    const { bookId, quantity } = payload;

    if (quantity <= 0)
      throw new BadRequestException(CartErrors.QUANTITY_NOT_ENOUGH);

    return await this.dataSource.transaction(
      async (manager): Promise<CartItem> => {
        const bookRepository = manager.getRepository(Book);
        const cartRepository = manager.getRepository(Cart);
        const cartItemRepository = manager.getRepository(CartItem);

        const book = await bookRepository.findOneBy({ id: bookId });

        if (!book) throw new NotFoundException(BookErrors.NOT_FOUND);

        let cart = await cartRepository.findOneBy({ user: { id: userId } });

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
          quantity,
          cart,
          book,
        });

        return cartItemRepository.save(item);
      },
    );
  }

  async updateItemQuantity(
    userId: number,
    bookId: number,
    quantity: number,
  ): Promise<CartItem | void> {
    if (quantity <= 0) return await this.deleteItemFromCart(userId, bookId);

    return this.dataSource.transaction(async (manager) => {
      const cartRepository = manager.getRepository(Cart);
      const cartItemRepository = manager.getRepository(CartItem);

      const cart = await cartRepository.findOneBy({ user: { id: userId } });

      if (!cart) throw new NotFoundException(CartErrors.NOT_FOUND);

      const item = await cartItemRepository.findOne({
        where: { cart: { id: cart.id }, book: { id: bookId } },
      });

      if (!item) throw new NotFoundException(CartErrors.CART_ITEM_NOT_FOUND);

      if (quantity > item.book.stockCount)
        throw new BadRequestException(CartErrors.QUANTITY_NOT_AVAILABLE);

      const { affected } = await cartItemRepository.update(item.id, {
        quantity,
      });

      if (affected === 0)
        throw new BadRequestException(CartErrors.CART_ITEM_NOT_UPDATED);

      const updatedItem = await cartItemRepository.findOneBy({
        cart: { id: cart.id },
        book: { id: bookId },
      });

      if (!updatedItem)
        throw new NotFoundException(CartErrors.CART_ITEM_NOT_FOUND);

      return updatedItem;
    });
  }

  async deleteItemFromCart(userId: number, bookId: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const cartRepository = manager.getRepository(Cart);
      const cartItemRepository = manager.getRepository(CartItem);

      const cart = await cartRepository.findOneBy({ user: { id: userId } });

      if (!cart) throw new NotFoundException(CartErrors.NOT_FOUND);

      const item: CartItem | null = await cartItemRepository.findOneBy({
        cart: { id: cart.id },
        book: { id: bookId },
      });

      if (!item) throw new NotFoundException(CartErrors.CART_ITEM_NOT_FOUND);

      await cartItemRepository.remove(item);
    });
  }

  async deleteCart(userId: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const cartRepository = manager.getRepository(Cart);

      const cart = await cartRepository.findOneBy({
        user: { id: userId },
      });

      if (!cart) throw new NotFoundException(CartErrors.NOT_FOUND);

      await cartRepository.remove(cart);
    });
  }
}
