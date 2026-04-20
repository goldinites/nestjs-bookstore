import { CartItemResponse } from '@/modules/cart/types/cart-item.type';

export type CartResponse = {
  id: number;
  items: CartItemResponse[];
  itemsCount: number;
  totalPrice: number;
};
