import { Cart } from '@/modules/cart/entities/cart.entity';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';
import { CartItemResponse } from '@/modules/cart/types/cart-item.type';
import { CartResponse } from '@/modules/cart/types/cart.type';
import { mapUserToResponse } from '@/modules/user/mappers/user-to-response.mapper';
import { UserResponse } from '@/modules/user/types/user.type';

export function mapCartItemToResponse(item: CartItem): CartItemResponse {
  const bookData = item.book
    ? {
        bookId: item.book.id,
        imageUrl: item.book.imageUrl,
        title: item.book.title,
        price: Number(item.book.price),
      }
    : {};

  return {
    id: item.id,
    quantity: item.quantity,
    ...bookData,
  };
}

function calcItemsCount(items: CartItemResponse[]): number {
  return items.reduce(
    (acc: number, item: CartItemResponse): number => acc + (item.quantity ?? 0),
    0,
  );
}

function calcTotalPrice(items: CartItemResponse[]): number {
  return items.reduce(
    (acc: number, item: CartItemResponse): number =>
      acc + (item.quantity ?? 0) * (item.price ?? 0),
    0,
  );
}

export function mapCartToResponse(cart: Cart): CartResponse {
  const user: UserResponse | undefined = cart.user
    ? mapUserToResponse(cart.user)
    : undefined;

  const items: CartItemResponse[] | undefined = cart.items
    ? cart.items.map(mapCartItemToResponse)
    : undefined;

  const itemsCount: number | undefined = items
    ? calcItemsCount(items)
    : undefined;

  const totalPrice: number | undefined = items
    ? calcTotalPrice(items)
    : undefined;

  return {
    id: cart.id,
    user,
    items,
    itemsCount,
    totalPrice,
  };
}
