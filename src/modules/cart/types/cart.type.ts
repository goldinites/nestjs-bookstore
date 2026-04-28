import { CartItemResponse } from '@/modules/cart/types/cart-item.type';
import { UserResponse } from '@/modules/user/types/user.type';
import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';
import { Cart } from '@/modules/cart/entities/cart.entity';

export type GetCartOptions = {
  select?: FindOptionsSelect<Cart>;
  relations?: FindOptionsRelations<Cart>;
};

export type CartResponse = {
  id: number;
  user?: UserResponse;
  items?: CartItemResponse[];
  itemsCount?: number;
  totalPrice?: number;
};
