import { Cart } from '@/modules/cart/entities/cart.entity';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';
import { CartItemResponse } from '@/modules/cart/types/cart-item.type';
import { CartResponse } from '@/modules/cart/types/cart.type';

export function mapCartItemToResponse(item: CartItem): CartItemResponse {
  return {
    id: item.id,
    bookId: item.book.id,
    imageUrl: item.book.imageUrl,
    title: item.book.title,
    price: Number(item.book.price),
    quantity: item.quantity,
  };
}

export function mapCartToResponse(cart: Cart): CartResponse {
  const items: CartItemResponse[] = cart.items.map(mapCartItemToResponse);

  return {
    id: cart.id,
    items,
    itemsCount: items.reduce(
      (acc: number, item: CartItemResponse): number => acc + item.quantity,
      0,
    ),
    totalPrice: items.reduce(
      (acc: number, item: CartItemResponse): number =>
        acc + item.quantity * (item.price ?? 0),
      0,
    ),
  };
}
