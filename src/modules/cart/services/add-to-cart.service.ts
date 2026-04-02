import { AddToCartDto } from '@/modules/cart/dto/add-to-cart.dto';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CartErrors } from '../enums/errors.enum';
import { Book } from '@/modules/book/entities/book.entity';
import { Cart } from '@/modules/cart/entities/cart.entity';
import { BookErrors } from '@/modules/book/enums/errors.enum';
import { DataSource } from 'typeorm';

export async function addToCart(
  dataSource: DataSource,
  userId: number,
  payload: AddToCartDto,
): Promise<CartItem> {
  const { bookId, quantity } = payload;

  if (quantity <= 0)
    throw new BadRequestException(CartErrors.QUANTITY_NOT_ENOUGH);

  return await dataSource.transaction(async (manager) => {
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
