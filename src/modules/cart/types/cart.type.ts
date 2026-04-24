import { CartItemResponse } from '@/modules/cart/types/cart-item.type';
import { UserResponse } from '@/modules/user/types/user.type';

export type CartResponse = {
  id: number;
  user?: UserResponse;
  items?: CartItemResponse[];
  itemsCount?: number;
  totalPrice?: number;
};
